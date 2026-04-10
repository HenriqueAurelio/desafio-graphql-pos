import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { currentPeriodValue } from '@/lib/period'

import { useTransactions, type Transaction, type TransactionInput, type TransactionFilters as QueryFilters } from './useTransactions'
import { TransactionFilters } from './components/TransactionFilters'
import { TransactionTable } from './components/TransactionTable'
import { TransactionPagination } from './components/TransactionPagination'
import { TransactionModal } from './components/TransactionModal'
import { DeleteConfirmModal } from './components/DeleteConfirmModal'

const PAGE_SIZE = 10

export function TransactionsPage() {
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('ALL')
  const [categoryFilter, setCategoryFilter] = useState('ALL')
  const [period, setPeriod] = useState(currentPeriodValue)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput)
      setCurrentPage(1)
    }, 400)
    return () => clearTimeout(timer)
  }, [searchInput])

  const filters: QueryFilters = {
    search,
    type: typeFilter,
    categoryId: categoryFilter,
    period,
    page: currentPage,
    pageSize: PAGE_SIZE,
  }

  const {
    transactions,
    total,
    totalPages,
    categories,
    categoryMap,
    loading,
    creating,
    updating,
    deleting,
    createTransaction,
    updateTransaction,
    deleteTransaction,
  } = useTransactions(filters)

  const [modalOpen, setModalOpen] = useState(false)
  const [editingTx, setEditingTx] = useState<Transaction | undefined>()
  const [deletingTx, setDeletingTx] = useState<Transaction | undefined>()

  function resetPage() { setCurrentPage(1) }

  function openCreate() {
    setEditingTx(undefined)
    setModalOpen(true)
  }

  function openEdit(tx: Transaction) {
    setEditingTx(tx)
    setModalOpen(true)
  }

  async function handleSave(data: TransactionInput) {
    if (editingTx) {
      await updateTransaction(editingTx.id, data)
    } else {
      await createTransaction(data)
    }
  }

  async function handleConfirmDelete() {
    if (!deletingTx) return
    await deleteTransaction(deletingTx.id)
    setDeletingTx(undefined)
  }

  return (
    <>
      <main className="flex flex-col gap-8 p-12 flex-1">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <h1 className="text-[24px] font-bold text-[#111827] leading-8">Transações</h1>
            <p className="text-[16px] text-[#4b5563] leading-6">
              Gerencie todas as suas transações financeiras
            </p>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 bg-[#1f6f43] hover:bg-[#1a5e39] text-white text-[14px] font-medium px-3 py-2 rounded-lg transition-colors outline-none h-9 cursor-pointer"
          >
            <Plus className="size-4" />
            Nova transação
          </button>
        </div>

        <TransactionFilters
          searchInput={searchInput}
          onSearchChange={setSearchInput}
          typeFilter={typeFilter}
          onTypeChange={(v) => { setTypeFilter(v); resetPage() }}
          categoryFilter={categoryFilter}
          onCategoryChange={(v) => { setCategoryFilter(v); resetPage() }}
          period={period}
          onPeriodChange={(v) => { setPeriod(v); resetPage() }}
          categories={categories}
        />

        <div className="bg-white border border-[#e5e7eb] rounded-xl overflow-hidden">
          <TransactionTable
            transactions={transactions}
            categoryMap={categoryMap}
            loading={loading}
            onEdit={openEdit}
            onDelete={setDeletingTx}
          />
          <TransactionPagination
            currentPage={currentPage}
            totalPages={totalPages}
            total={total}
            pageSize={PAGE_SIZE}
            onPageChange={setCurrentPage}
          />
        </div>
      </main>

      {modalOpen && (
        <TransactionModal
          transaction={editingTx}
          categories={categories}
          saving={creating || updating}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
        />
      )}

      {deletingTx && (
        <DeleteConfirmModal
          transactionName={deletingTx.name}
          deleting={deleting}
          onClose={() => setDeletingTx(undefined)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </>
  )
}
