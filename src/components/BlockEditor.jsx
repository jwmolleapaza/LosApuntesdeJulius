// Componente Constructor de Bloques estilo Notion para la creación y edición de posts
import React, { useState } from 'react';
import { 
  Type, Heading1, Heading2, Heading3, AlertCircle, Quote, 
  List, CheckSquare, Grid, Code, Minus, ChevronDown, 
  Image, FileText, ExternalLink, Plus, Trash2, ArrowUp, ArrowDown, Settings
} from 'lucide-react';
import { Youtube } from './BrandIcons';

const BLOCK_TYPES = [
  { type: 'title-h1', label: 'Título H1', icon: Heading1, defaultContent: 'Nuevo Título Principal' },
  { type: 'title-h2', label: 'Título H2', icon: Heading2, defaultContent: 'Subtítulo Sección' },
  { type: 'title-h3', label: 'Título H3', icon: Heading3, defaultContent: 'Sub-subtítulo' },
  { type: 'paragraph', label: 'Párrafo', icon: Type, defaultContent: 'Escribe tu párrafo técnico aquí...' },
  { type: 'callout', label: 'Llamada (Callout)', icon: AlertCircle, defaultContent: '💡 Información importante...', style: 'info' },
  { type: 'quote', label: 'Cita', icon: Quote, defaultContent: 'La ingeniería es el arte de modelar la realidad.', author: 'Autor' },
  { type: 'list', label: 'Lista', icon: List, items: ['Elemento 1', 'Elemento 2'] },
  { type: 'checklist', label: 'Lista de Control', icon: CheckSquare, items: [{ text: 'Tarea 1', checked: false }] },
  { type: 'table', label: 'Tabla', icon: Grid, headers: ['Columna 1', 'Columna 2'], rows: [['Celda A1', 'Celda A2'], ['Celda B1', 'Celda B2']] },
  { type: 'code', label: 'Bloque de Código', icon: Code, content: '// Escribe tu código aquí\nconsole.log("Hello Julius");', language: 'javascript' },
  { type: 'divider', label: 'Divisor', icon: Minus },
  { type: 'accordion', label: 'Acordeón', icon: ChevronDown, summary: 'Pregunta o Título', content: 'Detalle del acordeón...' },
  { type: 'youtube', label: 'Video YouTube', icon: Youtube, content: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
  { type: 'image', label: 'Imagen', icon: Image, content: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80', caption: 'Descripción de la imagen' },
  { type: 'pdf', label: 'Documento PDF', icon: FileText, content: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', title: 'Planos Estructurales.pdf' },
  { type: 'button', label: 'Botón CTA', icon: ExternalLink, content: 'Descargar Plantilla', url: 'https://github.com' }
];

export default function BlockEditor({ blocks, onChange }) {
  const [showAddMenuIndex, setShowAddMenuIndex] = useState(null);

  const updateBlock = (index, updatedFields) => {
    const newBlocks = [...blocks];
    newBlocks[index] = { ...newBlocks[index], ...updatedFields };
    onChange(newBlocks);
  };

  const addBlock = (typeObj, insertIndex) => {
    const newBlock = {
      id: 'block-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      type: typeObj.type,
      content: typeObj.defaultContent || typeObj.content || '',
      ...typeObj
    };
    delete newBlock.icon; // No guardar el icono del array estático
    delete newBlock.label;

    const newBlocks = [...blocks];
    newBlocks.splice(insertIndex, 0, newBlock);
    onChange(newBlocks);
    setShowAddMenuIndex(null);
  };

  const removeBlock = (index) => {
    const newBlocks = blocks.filter((_, idx) => idx !== index);
    onChange(newBlocks);
  };

  const moveBlock = (index, direction) => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === blocks.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const newBlocks = [...blocks];
    const temp = newBlocks[index];
    newBlocks[index] = newBlocks[targetIndex];
    newBlocks[targetIndex] = temp;
    onChange(newBlocks);
  };

  // Helper para listas
  const handleListItemChange = (blockIdx, itemIdx, val) => {
    const block = blocks[blockIdx];
    const newItems = [...block.items];
    newItems[itemIdx] = val;
    updateBlock(blockIdx, { items: newItems });
  };

  const addListItem = (blockIdx) => {
    const block = blocks[blockIdx];
    updateBlock(blockIdx, { items: [...block.items, 'Nuevo elemento'] });
  };

  const removeListItem = (blockIdx, itemIdx) => {
    const block = blocks[blockIdx];
    const newItems = block.items.filter((_, idx) => idx !== itemIdx);
    updateBlock(blockIdx, { items: newItems });
  };

  // Helper para checklists
  const handleChecklistItemChange = (blockIdx, itemIdx, text, checked) => {
    const block = blocks[blockIdx];
    const newItems = [...block.items];
    newItems[itemIdx] = { text, checked };
    updateBlock(blockIdx, { items: newItems });
  };

  const addChecklistItem = (blockIdx) => {
    const block = blocks[blockIdx];
    updateBlock(blockIdx, { items: [...block.items, { text: 'Nueva tarea', checked: false }] });
  };

  const removeChecklistItem = (blockIdx, itemIdx) => {
    const block = blocks[blockIdx];
    const newItems = block.items.filter((_, idx) => idx !== itemIdx);
    updateBlock(blockIdx, { items: newItems });
  };

  // Helper para tablas
  const handleTableHeaderChange = (blockIdx, colIdx, val) => {
    const block = blocks[blockIdx];
    const newHeaders = [...block.headers];
    newHeaders[colIdx] = val;
    updateBlock(blockIdx, { headers: newHeaders });
  };

  const handleTableCellChange = (blockIdx, rowIdx, colIdx, val) => {
    const block = blocks[blockIdx];
    const newRows = block.rows.map((row, rIdx) => 
      rIdx === rowIdx ? row.map((cell, cIdx) => cIdx === colIdx ? val : cell) : row
    );
    updateBlock(blockIdx, { rows: newRows });
  };

  const addTableColumn = (blockIdx) => {
    const block = blocks[blockIdx];
    const newHeaders = [...block.headers, `Columna ${block.headers.length + 1}`];
    const newRows = block.rows.map(row => [...row, 'Celda']);
    updateBlock(blockIdx, { headers: newHeaders, rows: newRows });
  };

  const addTableRow = (blockIdx) => {
    const block = blocks[blockIdx];
    const newRow = Array(block.headers.length).fill('Celda');
    updateBlock(blockIdx, { rows: [...block.rows, newRow] });
  };

  const removeTableColumn = (blockIdx) => {
    const block = blocks[blockIdx];
    if (block.headers.length <= 1) return;
    const newHeaders = block.headers.slice(0, -1);
    const newRows = block.rows.map(row => row.slice(0, -1));
    updateBlock(blockIdx, { headers: newHeaders, rows: newRows });
  };

  const removeTableRow = (blockIdx) => {
    const block = blocks[blockIdx];
    if (block.rows.length <= 1) return;
    const newRows = block.rows.slice(0, -1);
    updateBlock(blockIdx, { rows: newRows });
  };

  return (
    <div className="block-editor-container">
      
      {/* Botón para insertar bloque al inicio */}
      <div className="insert-divider-line">
        <button className="btn-insert-divider" onClick={() => setShowAddMenuIndex(0)}>
          <Plus size={12} /> Insertar Bloque al Inicio
        </button>
      </div>

      {showAddMenuIndex === 0 && (
        <div className="block-select-menu">
          {BLOCK_TYPES.map(bt => (
            <button key={bt.type} className="block-select-item" onClick={() => addBlock(bt, 0)}>
              <bt.icon size={16} />
              <span>{bt.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Renderizado de Bloques Editables */}
      {blocks.map((block, idx) => (
        <div key={block.id || idx} className="editor-block-card">
          
          {/* Controles de Bloque */}
          <div className="editor-block-meta-row">
            <span className="block-type-badge">{block.type.toUpperCase()}</span>
            <div className="block-actions-toolbar">
              <button onClick={() => moveBlock(idx, 'up')} disabled={idx === 0} title="Mover arriba">
                <ArrowUp size={14} />
              </button>
              <button onClick={() => moveBlock(idx, 'down')} disabled={idx === blocks.length - 1} title="Mover abajo">
                <ArrowDown size={14} />
              </button>
              <button className="delete-btn" onClick={() => removeBlock(idx)} title="Eliminar bloque">
                <Trash2 size={14} />
              </button>
            </div>
          </div>

          <div className="editor-block-inner-content">
            {/* Input común de una línea para textos, encabezados y citas */}
            {['title-h1', 'title-h2', 'title-h3', 'paragraph'].includes(block.type) && (
              <textarea
                className={`editor-input-${block.type}`}
                value={block.content || ''}
                rows={block.type === 'paragraph' ? 3 : 1}
                placeholder={`Escribe el contenido del ${block.type}...`}
                onChange={(e) => updateBlock(idx, { content: e.target.value })}
              />
            )}

            {/* Bloque Callout */}
            {block.type === 'callout' && (
              <div className="editor-callout-fields">
                <select 
                  value={block.style || 'info'} 
                  onChange={(e) => updateBlock(idx, { style: e.target.value })}
                  className="editor-sub-select"
                >
                  <option value="info">💡 Informativo (Azul)</option>
                  <option value="warning">⚠️ Advertencia (Amarillo)</option>
                  <option value="danger">🚫 Alerta (Rojo)</option>
                </select>
                <textarea
                  value={block.content || ''}
                  placeholder="Mensaje de llamada..."
                  onChange={(e) => updateBlock(idx, { content: e.target.value })}
                  rows={2}
                />
              </div>
            )}

            {/* Bloque Cita */}
            {block.type === 'quote' && (
              <div className="editor-quote-fields">
                <textarea
                  value={block.content || ''}
                  placeholder="Texto de la cita..."
                  onChange={(e) => updateBlock(idx, { content: e.target.value })}
                  rows={2}
                />
                <input
                  type="text"
                  value={block.author || ''}
                  placeholder="Autor / Referencia"
                  onChange={(e) => updateBlock(idx, { author: e.target.value })}
                  className="editor-sub-input"
                />
              </div>
            )}

            {/* Bloque Lista */}
            {block.type === 'list' && (
              <div className="editor-list-fields">
                {block.items && block.items.map((item, itemIdx) => (
                  <div key={itemIdx} className="editor-list-item-row">
                    <span className="bullet-indicator">•</span>
                    <input 
                      type="text" 
                      value={item} 
                      onChange={(e) => handleListItemChange(idx, itemIdx, e.target.value)}
                    />
                    <button className="btn-icon delete" onClick={() => removeListItem(idx, itemIdx)}>
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
                <button className="btn-secondary btn-sm" onClick={() => addListItem(idx)}>
                  + Agregar Viñeta
                </button>
              </div>
            )}

            {/* Bloque Checklist */}
            {block.type === 'checklist' && (
              <div className="editor-checklist-fields">
                {block.items && block.items.map((item, itemIdx) => (
                  <div key={itemIdx} className="editor-list-item-row">
                    <input 
                      type="checkbox" 
                      checked={item.checked} 
                      onChange={(e) => handleChecklistItemChange(idx, itemIdx, item.text, e.target.checked)}
                    />
                    <input 
                      type="text" 
                      value={item.text} 
                      onChange={(e) => handleChecklistItemChange(idx, itemIdx, e.target.value, item.checked)}
                    />
                    <button className="btn-icon delete" onClick={() => removeChecklistItem(idx, itemIdx)}>
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
                <button className="btn-secondary btn-sm" onClick={() => addChecklistItem(idx)}>
                  + Agregar Tarea
                </button>
              </div>
            )}

            {/* Bloque Tabla */}
            {block.type === 'table' && (
              <div className="editor-table-fields">
                <div className="editor-table-controls-row">
                  <button className="btn-secondary btn-sm" onClick={() => addTableColumn(idx)}>+ Columna</button>
                  <button className="btn-secondary btn-sm" onClick={() => addTableRow(idx)}>+ Fila</button>
                  <button className="btn-secondary btn-sm" onClick={() => removeTableColumn(idx)}>- Columna</button>
                  <button className="btn-secondary btn-sm" onClick={() => removeTableRow(idx)}>- Fila</button>
                </div>
                <div className="editor-table-scroll">
                  <table className="editor-rendered-table">
                    <thead>
                      <tr>
                        {block.headers.map((h, colIdx) => (
                          <th key={colIdx}>
                            <input 
                              type="text" 
                              value={h} 
                              onChange={(e) => handleTableHeaderChange(idx, colIdx, e.target.value)}
                            />
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {block.rows.map((row, rowIdx) => (
                        <tr key={rowIdx}>
                          {row.map((cell, colIdx) => (
                            <td key={colIdx}>
                              <input 
                                type="text" 
                                value={cell} 
                                onChange={(e) => handleTableCellChange(idx, rowIdx, colIdx, e.target.value)}
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Bloque Código */}
            {block.type === 'code' && (
              <div className="editor-code-fields">
                <div className="editor-form-row">
                  <select 
                    value={block.language || 'javascript'} 
                    onChange={(e) => updateBlock(idx, { language: e.target.value })}
                    className="editor-sub-select"
                  >
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                    <option value="html">HTML</option>
                    <option value="css">CSS</option>
                    <option value="sql">SQL</option>
                    <option value="xer">Primavera P6 (.XER)</option>
                    <option value="json">JSON</option>
                  </select>
                </div>
                <textarea
                  className="editor-code-textarea"
                  value={block.content || ''}
                  rows={6}
                  placeholder="Ingresa el código o script aquí..."
                  onChange={(e) => updateBlock(idx, { content: e.target.value })}
                />
              </div>
            )}

            {/* Bloque YouTube */}
            {block.type === 'youtube' && (
              <div className="editor-url-caption-fields">
                <input
                  type="text"
                  value={block.content || ''}
                  placeholder="URL o ID de Video de YouTube (ej. https://youtube.com/watch?v=...)"
                  onChange={(e) => updateBlock(idx, { content: e.target.value })}
                />
              </div>
            )}

            {/* Bloque Imagen */}
            {block.type === 'image' && (
              <div className="editor-url-caption-fields">
                <input
                  type="text"
                  value={block.content || ''}
                  placeholder="URL de la imagen (ej: https://images.unsplash.com/...)"
                  onChange={(e) => updateBlock(idx, { content: e.target.value })}
                />
                <input
                  type="text"
                  value={block.caption || ''}
                  placeholder="Descripción de la imagen"
                  onChange={(e) => updateBlock(idx, { caption: e.target.value })}
                  className="editor-sub-input"
                />
              </div>
            )}

            {/* Bloque PDF */}
            {block.type === 'pdf' && (
              <div className="editor-url-caption-fields">
                <input
                  type="text"
                  value={block.content || ''}
                  placeholder="URL del archivo PDF (ej: https://site.com/doc.pdf)"
                  onChange={(e) => updateBlock(idx, { content: e.target.value })}
                />
                <input
                  type="text"
                  value={block.title || ''}
                  placeholder="Nombre amigable del documento"
                  onChange={(e) => updateBlock(idx, { title: e.target.value })}
                  className="editor-sub-input"
                />
              </div>
            )}

            {/* Bloque Botón CTA */}
            {block.type === 'button' && (
              <div className="editor-url-caption-fields">
                <input
                  type="text"
                  value={block.content || ''}
                  placeholder="Texto del botón"
                  onChange={(e) => updateBlock(idx, { content: e.target.value })}
                />
                <input
                  type="text"
                  value={block.url || ''}
                  placeholder="URL enlace externo"
                  onChange={(e) => updateBlock(idx, { url: e.target.value })}
                  className="editor-sub-input"
                />
              </div>
            )}

            {/* Bloque Divisor */}
            {block.type === 'divider' && (
              <div className="editor-divider-preview">
                <hr />
              </div>
            )}

            {/* Bloque Acordeón */}
            {block.type === 'accordion' && (
              <div className="editor-accordion-fields">
                <input
                  type="text"
                  value={block.summary || ''}
                  placeholder="Pregunta o Encabezado del Acordeón..."
                  onChange={(e) => updateBlock(idx, { summary: e.target.value })}
                />
                <textarea
                  value={block.content || ''}
                  placeholder="Contenido desplegable del acordeón..."
                  onChange={(e) => updateBlock(idx, { content: e.target.value })}
                  rows={2}
                />
              </div>
            )}
          </div>

          {/* Botón para insertar bloque debajo de este */}
          <div className="insert-divider-line">
            <button className="btn-insert-divider" onClick={() => setShowAddMenuIndex(idx + 1)}>
              <Plus size={12} /> Insertar Bloque Aquí
            </button>
          </div>

          {showAddMenuIndex === (idx + 1) && (
            <div className="block-select-menu">
              {BLOCK_TYPES.map(bt => (
                <button key={bt.type} className="block-select-item" onClick={() => addBlock(bt, idx + 1)}>
                  <bt.icon size={16} />
                  <span>{bt.label}</span>
                </button>
              ))}
            </div>
          )}

        </div>
      ))}

      <style dangerouslySetInnerHTML={{__html: `
        .block-editor-container {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .editor-block-card {
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          background-color: var(--bg-card);
          padding: 16px;
          margin-bottom: 8px;
          box-shadow: var(--shadow-sm);
        }
        .editor-block-meta-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          padding-bottom: 6px;
          border-bottom: 1px solid var(--border);
        }
        .block-type-badge {
          font-family: var(--font-code);
          font-size: 10px;
          background-color: var(--bg-surface);
          padding: 2px 6px;
          border-radius: 4px;
          font-weight: bold;
          color: var(--text-muted);
        }
        .block-actions-toolbar {
          display: flex;
          gap: 4px;
        }
        .block-actions-toolbar button {
          padding: 4px;
          background-color: var(--bg-surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          color: var(--text-muted);
        }
        .block-actions-toolbar button:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
        .block-actions-toolbar button:not(:disabled):hover {
          background-color: var(--border);
          color: var(--text-main);
        }
        .block-actions-toolbar button.delete-btn:hover {
          background-color: #fef2f2;
          color: #ef4444;
          border-color: #fecaca;
        }
        .editor-block-inner-content textarea, 
        .editor-block-inner-content input {
          width: 100%;
          font-size: 14px;
          padding: 8px 10px;
          margin-bottom: 8px;
        }
        .editor-block-inner-content input:last-child,
        .editor-block-inner-content textarea:last-child {
          margin-bottom: 0;
        }
        .editor-input-title-h1 {
          font-size: 24px;
          font-weight: 700;
          font-family: var(--font-title);
          border: none;
          border-bottom: 1px solid var(--border);
        }
        .editor-input-title-h2 {
          font-size: 20px;
          font-weight: 700;
          font-family: var(--font-title);
          border: none;
        }
        .editor-input-title-h3 {
          font-size: 16px;
          font-weight: 700;
          font-family: var(--font-title);
          border: none;
        }
        .editor-input-paragraph {
          border: none;
          resize: vertical;
        }
        .editor-sub-select {
          padding: 6px 10px;
          margin-bottom: 8px;
          border-radius: var(--radius-sm);
          font-size: 12px;
          width: fit-content;
        }
        .editor-sub-input {
          font-size: 12px !important;
          padding: 6px 8px !important;
        }
        .editor-list-fields, .editor-checklist-fields {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .editor-list-item-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .bullet-indicator {
          font-size: 18px;
          color: var(--text-muted);
        }
        .btn-sm {
          padding: 6px 12px;
          font-size: 12px;
          width: fit-content;
          margin-top: 4px;
        }
        /* Tablas */
        .editor-table-controls-row {
          display: flex;
          gap: 6px;
          margin-bottom: 10px;
        }
        .editor-table-scroll {
          overflow-x: auto;
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
        }
        .editor-rendered-table {
          width: 100%;
          border-collapse: collapse;
        }
        .editor-rendered-table th, .editor-rendered-table td {
          border: 1px solid var(--border);
          padding: 6px;
        }
        .editor-rendered-table input {
          border: none !important;
          padding: 4px !important;
          margin: 0 !important;
          font-size: 13px !important;
          background: none !important;
        }
        .editor-rendered-table input:focus {
          box-shadow: none !important;
        }
        /* Código */
        .editor-code-textarea {
          font-family: var(--font-code);
          background-color: #0f172a;
          color: #e2e8f0;
          border: 1px solid #1e293b;
          resize: vertical;
        }
        /* Divisor */
        .editor-divider-preview hr {
          border: none;
          height: 1px;
          background-color: var(--border);
          margin: 12px 0;
        }
        /* Menú de selección */
        .block-select-menu {
          background-color: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-lg);
          padding: 8px;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
          gap: 6px;
          z-index: 50;
          margin: 8px 0;
        }
        .block-select-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px;
          border-radius: var(--radius-sm);
          background: none;
          color: var(--text-muted);
          cursor: pointer;
          font-size: 12px;
          font-weight: 500;
          text-align: left;
          transition: background-color var(--transition-fast);
        }
        .block-select-item:hover {
          background-color: var(--bg-surface);
          color: var(--text-main);
        }
        /* Divisores de inserción */
        .insert-divider-line {
          height: 20px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0.15;
          transition: opacity var(--transition-fast);
          margin: 4px 0;
        }
        .insert-divider-line:hover {
          opacity: 1;
        }
        .insert-divider-line::before {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          height: 1px;
          background-color: var(--primary);
          z-index: 1;
        }
        .btn-insert-divider {
          position: relative;
          z-index: 2;
          font-size: 10px;
          padding: 2px 8px;
          background-color: var(--primary);
          color: white;
          border-radius: var(--radius-full);
          font-weight: bold;
        }
      `}} />
    </div>
  );
}
