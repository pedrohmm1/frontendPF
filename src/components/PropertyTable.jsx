function formatBRL(v) {
  return v?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) ?? '-'
}

function formatDate(iso) {
  if (!iso) return '-'
  return new Date(iso).toLocaleString('pt-BR')
}

export default function PropertyTable({ items, canDelete, onDelete }) {
  if (!items.length) {
    return <div className="empty">Nenhum imóvel cadastrado.</div>
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Código</th>
          <th>Preço</th>
          <th>Status</th>
          <th>Cadastrado por</th>
          <th>Data cadastro</th>
          {canDelete && <th>Ações</th>}
        </tr>
      </thead>
      <tbody>
        {items.map((p) => (
          <tr key={p.id}>
            <td>{p.codigo}</td>
            <td>{formatBRL(p.preco)}</td>
            <td>
              <span className={`badge badge-${p.status.toLowerCase()}`}>{p.status}</span>
            </td>
            <td>{p.emailAdmin}</td>
            <td>{formatDate(p.dataCadastro)}</td>
            {canDelete && (
              <td>
                <button className="btn-danger" onClick={() => onDelete(p.id)}>Excluir</button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
