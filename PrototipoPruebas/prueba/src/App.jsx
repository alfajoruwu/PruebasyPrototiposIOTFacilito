import { useState, useRef } from 'react'
import './App.css'

// Iconos
import { FaSun, FaCloudRain, FaTemperatureHigh, FaTree } from 'react-icons/fa'

function App() {
  // Lista de imágenes disponibles
  const availableImages = [
    {
      id: 'tree',
      name: 'Árbol',
      src: '/write-parts-of-a-tree-worksheet-for-kids-free-vector.jpg'
    },
    {
      id: 'mountain',
      name: 'matorral',
      src: '/images.jpeg' // Asegúrate de tener esta imagen en public/
    },
    {
      id: 'city',
      name: 'cultivo',
      src: '/organic-vs-synthetic-fertilizers-how-they-work-es.png.png' // Asegúrate de tener esta imagen en public/
    }
  ]

  const [diagrams, setDiagrams] = useState([
    {
      id: Date.now(),
      name: 'Diagrama 1',
      imageId: 'tree', // Referencia al ID de la imagen
      points: []
    }
  ])

  const [selectedDiagramId, setSelectedDiagramId] = useState(diagrams[0]?.id)
  const [selectedPoint, setSelectedPoint] = useState(null)
  const containerRef = useRef(null)

  // Iconos
  const icons = {
    sun: { component: FaSun, color: "#FFD700", label: "Clima: Soleado" },
    rain: { component: FaCloudRain, color: "#4682B4", label: "Clima: Lluvioso" },
    temp: { component: FaTemperatureHigh, color: "#FF4500", label: "Temperatura alta" },
    tree: { component: FaTree, color: "#228B22", label: "Árbol seleccionado" }
  }

  const selectedDiagram = diagrams.find(d => d.id === selectedDiagramId) || diagrams[0]
  const currentImage = availableImages.find(img => img.id === selectedDiagram.imageId)
  const fullImagePath = currentImage ? currentImage.src : ''

  const handleImageClick = (e) => {
    const container = containerRef.current
    if (!container) return

    const rect = container.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const percentX = (x / rect.width) * 100
    const percentY = (y / rect.height) * 100

    const newPoint = {
      id: Date.now(),
      percentX,
      percentY,
      iconType: 'sun',
      customText: `Punto ${selectedDiagram.points.length + 1}`,
      presetText: icons['sun'].label,
      color: icons['sun'].color,
      size: 30
    }

    const updatedDiagrams = diagrams.map(diagram =>
      diagram.id === selectedDiagramId
        ? {
            ...diagram,
            points: [...diagram.points, newPoint]
          }
        : diagram
    )

    setDiagrams(updatedDiagrams)
    setSelectedPoint(newPoint)
  }

  const updateSelectedPoint = (updates) => {
    const updatedPoint = { ...selectedPoint, ...updates }

    const updatedDiagrams = diagrams.map(diagram =>
      diagram.id === selectedDiagramId
        ? {
            ...diagram,
            points: diagram.points.map(p =>
              p.id === selectedPoint.id ? updatedPoint : p
            )
          }
        : diagram
    )

    setDiagrams(updatedDiagrams)
    setSelectedPoint(updatedPoint)
  }

  const handleIconChange = (type) => {
    const selectedIcon = icons[type]
    updateSelectedPoint({
      iconType: type,
      presetText: selectedIcon.label,
      color: selectedIcon.color
    })
  }

  const handleCustomTextChange = (e) => {
    updateSelectedPoint({ customText: e.target.value })
  }

  const handleSizeChange = (e) => {
    updateSelectedPoint({ size: parseInt(e.target.value) })
  }

  const handleAddDiagram = () => {
    const newDiagram = {
      id: Date.now(),
      name: `Diagrama ${diagrams.length + 1}`,
      imageId: 'tree',
      points: []
    }

    setDiagrams([...diagrams, newDiagram])
    setSelectedDiagramId(newDiagram.id)
    setSelectedPoint(null)
  }

  const handleDiagramChange = (e) => {
    setSelectedDiagramId(parseInt(e.target.value))
    setSelectedPoint(null)
  }

  const handleImageSelect = (e) => {
    const imageId = e.target.value

    const updatedDiagrams = diagrams.map(diagram =>
      diagram.id === selectedDiagramId
        ? { ...diagram, imageId }
        : diagram
    )

    setDiagrams(updatedDiagrams)
  }

  return (
    <div className="app-container">
      {/* Sidebar izquierdo: Diagramas */}
      <aside className="sidebar left-sidebar">
        <h2>Diagramas</h2>
        <select onChange={handleDiagramChange} value={selectedDiagramId}>
          {diagrams.map(diagram => (
            <option key={diagram.id} value={diagram.id}>
              {diagram.name}
            </option>
          ))}
        </select>
        <button onClick={handleAddDiagram} className="btn-add">+ Nuevo Diagrama</button>

        <h3>Imagen</h3>
        <select onChange={handleImageSelect} value={selectedDiagram.imageId}>
          {availableImages.map(image => (
            <option key={image.id} value={image.id}>
              {image.name}
            </option>
          ))}
        </select>

        <h3>Marcas</h3>
        <ul>
          {selectedDiagram.points.map((point) => (
            <li
              key={point.id}
              onClick={() => setSelectedPoint(point)}
              className={`point-item ${selectedPoint?.id === point.id ? 'active' : ''}`}
            >
              {point.customText} ({point.percentX.toFixed(1)}%, {point.percentY.toFixed(1)}%)
            </li>
          ))}
        </ul>
      </aside>

      {/* Área principal con imagen redimensionable */}
      <main className="main-content">
        <div className="resizable-wrapper" ref={containerRef} onClick={handleImageClick}>
          <img
            src={fullImagePath}
            alt="Diagrama"
            className="stretch-image"
          />

          {/* Mostrar iconos y texto sobre la imagen */}
          {selectedDiagram.points.map((point) => {
            const IconComponent = icons[point.iconType].component
            return (
              <div
                key={point.id}
                className="point-marker"
                style={{
                  left: `${point.percentX}%`,
                  top: `${point.percentY}%`,
                  transform: 'translate(-50%, -50%)',
                  borderColor: point.color
                }}
              >
                <IconComponent
                  size={point.size}
                  color={point.color}
                />
                <span>{point.customText}</span>
              </div>
            )
          })}
        </div>
      </main>

      {/* Sidebar derecho: Configuración del punto seleccionado */}
      <aside className="sidebar right-sidebar">
        <h2>Configuración del Punto</h2>
        {selectedPoint ? (
          <div className="point-config">
            <label>
              <strong>Selecciona un icono:</strong>
            </label>
            <div className="icon-options">
              {Object.entries(icons).map(([key, data]) => (
                <div
                  key={key}
                  className={`icon-option ${selectedPoint.iconType === key ? 'selected' : ''}`}
                  onClick={() => handleIconChange(key)}
                  title={data.label}
                >
                  <data.component size={20} color={data.color} />
                </div>
              ))}
            </div>

            <label>
              <strong>Tamaño del icono:</strong>
            </label>
            <input
              type="range"
              min="20"
              max="60"
              value={selectedPoint.size}
              onChange={handleSizeChange}
              className="size-slider"
            />

            <label>
              <strong>Texto personalizado:</strong>
            </label>
            <input
              type="text"
              value={selectedPoint.customText}
              onChange={handleCustomTextChange}
              className="custom-text-input"
            />

            <div className="preset-info">
              <strong>Info predefinida:</strong> {selectedPoint.presetText}
            </div>
          </div>
        ) : (
          <p>No hay punto seleccionado</p>
        )}
      </aside>
    </div>
  )
}

export default App