import { useState } from 'react'
import { ArrowUpDown, Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { SummaryCard } from '@/components/SummaryCard'
import { getIcon, TagIcon } from '@/lib/categoryConfig'
import { useCategories, type Category } from './useCategories'
import { CategoryCard } from './components/CategoryCard'
import { CategoryModal } from './components/CategoryModal'
import { DeleteConfirmModal } from './components/DeleteConfirmModal'

export function CategoriesPage() {
  const {
    categories,
    totalTransactions,
    topCategory,
    getCategoryTxCount,
    loading,
    creating,
    updating,
    deleting,
    createCategory,
    updateCategory,
    deleteCategory,
  } = useCategories()

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Category | null>(null)
  const [pendingDelete, setPendingDelete] = useState<Category | null>(null)

  function openCreate() {
    setEditing(null)
    setModalOpen(true)
  }

  function openEdit(cat: Category) {
    setEditing(cat)
    setModalOpen(true)
  }

  function handleDelete(id: string) {
    const cat = categories.find((c) => c.id === id) ?? null
    setPendingDelete(cat)
  }

  async function confirmDelete() {
    if (!pendingDelete) return
    try {
      await deleteCategory(pendingDelete.id)
    } finally {
      setPendingDelete(null)
    }
  }

  async function handleSubmit(data: { title: string; description?: string; icon: string; color: string }) {
    if (editing) {
      await updateCategory(editing.id, data)
    } else {
      await createCategory(data)
    }
    setModalOpen(false)
    setEditing(null)
  }

  const TopIcon = topCategory ? getIcon(topCategory.icon) : TagIcon

  return (
    <>
      <main className="p-12 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-[24px] font-bold text-[#111827] leading-8">Categorias</h1>
            <p className="text-[14px] text-[#6b7280] leading-5">
              Organize suas transações por categorias
            </p>
          </div>
          <Button
            onClick={openCreate}
            className="flex items-center gap-2 h-10 px-4 rounded-lg bg-[#1f6f43] hover:bg-[#166534] text-white text-[14px] font-medium"
          >
            <Plus className="size-4" />
            Nova categoria
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <SummaryCard
            variant="horizontal"
            icon={TagIcon}
            iconColor="#7e22ce"
            label="Total de categorias"
            value={loading ? '...' : String(categories.length)}
          />
          <SummaryCard
            variant="horizontal"
            icon={ArrowUpDown}
            iconColor="#1d4ed8"
            label="Total de transações"
            value={loading ? '...' : String(totalTransactions)}
          />
          <SummaryCard
            variant="horizontal"
            icon={TopIcon}
            iconColor="#15803d"
            label="Categoria mais utilizada"
            value={loading ? '...' : topCategory?.title ?? '—'}
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-40 text-[#9ca3af] text-sm">
            Carregando...
          </div>
        ) : categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 gap-3">
            <TagIcon className="size-8 text-[#d1d5db]" />
            <span className="text-[#9ca3af] text-sm">Nenhuma categoria ainda</span>
            <Button
              onClick={openCreate}
              className="flex items-center gap-2 h-9 px-4 rounded-lg bg-[#1f6f43] hover:bg-[#166534] text-white text-[14px] font-medium"
            >
              <Plus className="size-4" />
              Nova categoria
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-6">
            {categories.map((cat) => (
              <CategoryCard
                key={cat.id}
                category={cat}
                txCount={getCategoryTxCount(cat.id)}
                onEdit={openEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>

      {modalOpen && (
        <CategoryModal
          editing={editing}
          saving={creating || updating}
          onClose={() => {
            setModalOpen(false)
            setEditing(null)
          }}
          onSubmit={handleSubmit}
        />
      )}

      {pendingDelete && (
        <DeleteConfirmModal
          category={pendingDelete}
          txCount={getCategoryTxCount(pendingDelete.id)}
          deleting={deleting}
          onCancel={() => setPendingDelete(null)}
          onConfirm={confirmDelete}
        />
      )}
    </>
  )
}
