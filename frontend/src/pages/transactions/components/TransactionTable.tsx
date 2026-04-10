import { TxRow } from './TxRow'
import type { Transaction, Category } from '../useTransactions'

interface TransactionTableProps {
  transactions: Transaction[]
  categoryMap: Map<string, Category>
  loading: boolean
  onEdit: (tx: Transaction) => void
  onDelete: (tx: Transaction) => void
}

const COLUMNS = [
  { label: 'Descrição',  className: 'flex flex-1 items-center px-6 py-5' },
  { label: 'Data',       className: 'flex items-center justify-center px-6 py-5 w-[112px] shrink-0' },
  { label: 'Categoria',  className: 'flex items-center justify-center px-6 py-5 w-[200px] shrink-0' },
  { label: 'Tipo',       className: 'flex items-center justify-center px-6 py-5 w-[136px] shrink-0' },
  { label: 'Valor',      className: 'flex items-center justify-end px-6 py-5 w-[200px] shrink-0' },
  { label: 'Ações',      className: 'flex items-center justify-end px-6 py-5 w-[120px] shrink-0' },
]

export function TransactionTable({
  transactions,
  categoryMap,
  loading,
  onEdit,
  onDelete,
}: TransactionTableProps) {
  return (
    <>
      <div className="flex items-center border-b border-[#e5e7eb]">
        {COLUMNS.map((col) => (
          <div key={col.label} className={col.className}>
            <span className="text-[12px] font-medium text-[#6b7280] uppercase tracking-[0.6px] leading-4">
              {col.label}
            </span>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-20 text-[#9ca3af] text-sm">
          Carregando...
        </div>
      ) : transactions.length === 0 ? (
        <div className="flex items-center justify-center h-20 text-[#9ca3af] text-sm">
          Nenhuma transação encontrada
        </div>
      ) : (
        transactions.map((tx, i) => (
          <TxRow
            key={tx.id}
            transaction={tx}
            category={categoryMap.get(tx.categoryId)}
            isLast={i === transactions.length - 1}
            onEdit={() => onEdit(tx)}
            onDelete={() => onDelete(tx)}
          />
        ))
      )}
    </>
  )
}
