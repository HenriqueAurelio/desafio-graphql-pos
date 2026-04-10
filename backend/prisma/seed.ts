import 'dotenv/config'
import { PrismaClient } from './generated/prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import bcrypt from 'bcryptjs'

// ─── Seed user config ─────────────────────────────────────────────────────────
// Override via env: SEED_EMAIL=meu@email.com npm run seed
const SEED_EMAIL = process.env.SEED_EMAIL ?? 'seed@financy.com'
const SEED_PASSWORD = process.env.SEED_PASSWORD ?? 'seed123'
const SEED_NAME = 'Usuário Seed'

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

// ─── Categories ───────────────────────────────────────────────────────────────

const CATEGORIES = [
  { title: 'Alimentação',   description: 'Refeições, mercado e delivery',           icon: 'utensils',         color: 'green'  },
  { title: 'Transporte',    description: 'Combustível, Uber, ônibus e metrô',       icon: 'car',              color: 'blue'   },
  { title: 'Moradia',       description: 'Aluguel, condomínio e contas da casa',    icon: 'home',             color: 'orange' },
  { title: 'Saúde',         description: 'Plano de saúde, consultas e farmácia',    icon: 'heart',            color: 'red'    },
  { title: 'Lazer',         description: 'Cinema, streaming e hobbies',             icon: 'music',            color: 'purple' },
  { title: 'Salário',       description: 'Renda principal do trabalho',             icon: 'briefcase-business', color: 'green' },
  { title: 'Freelance',     description: 'Projetos e serviços extras',              icon: 'wallet',           color: 'blue'   },
  { title: 'Investimentos', description: 'Aportes em renda fixa e variável',        icon: 'piggy-bank',       color: 'yellow' },
  { title: 'Educação',      description: 'Cursos, livros e assinaturas técnicas',   icon: 'zap',              color: 'purple' },
  { title: 'Vestuário',     description: 'Roupas, calçados e acessórios',           icon: 'shopping-cart',    color: 'pink'   },
]

// ─── Transaction templates ────────────────────────────────────────────────────

function d(year: number, month: number, day: number) {
  return new Date(year, month - 1, day)
}

function tx(
  name: string,
  amount: number,
  type: 'INCOME' | 'EXPENSE',
  catKey: string,
  date: Date,
) {
  return { name, amount, type, catKey, date }
}

type TxDef = ReturnType<typeof tx>

// Generates transactions for a given month offset (0 = current month Apr 2026)
function monthTransactions(year: number, month: number): TxDef[] {
  return [
    // ── Receitas ──────────────────────────────────────────────────────────
    tx('Salário mensal',               6800.00, 'INCOME',  'Salário',       d(year, month, 5)),
    tx('Freelance – sistema web',      1500.00, 'INCOME',  'Freelance',     d(year, month, 12)),
    tx('Rendimento investimentos',      320.50, 'INCOME',  'Investimentos', d(year, month, 15)),

    // ── Moradia ───────────────────────────────────────────────────────────
    tx('Aluguel',                      1800.00, 'EXPENSE', 'Moradia',       d(year, month, 5)),
    tx('Conta de luz',                  210.40, 'EXPENSE', 'Moradia',       d(year, month, 10)),
    tx('Conta de água',                  87.20, 'EXPENSE', 'Moradia',       d(year, month, 10)),
    tx('Internet',                      119.90, 'EXPENSE', 'Moradia',       d(year, month, 15)),

    // ── Alimentação ───────────────────────────────────────────────────────
    tx('Supermercado semanal',          380.00, 'EXPENSE', 'Alimentação',   d(year, month, 2)),
    tx('iFood – almoço',                 52.90, 'EXPENSE', 'Alimentação',   d(year, month, 8)),
    tx('Supermercado semanal',          420.00, 'EXPENSE', 'Alimentação',   d(year, month, 9)),
    tx('Padaria',                        18.50, 'EXPENSE', 'Alimentação',   d(year, month, 14)),
    tx('Supermercado semanal',          360.00, 'EXPENSE', 'Alimentação',   d(year, month, 16)),
    tx('Restaurante – jantar',           95.00, 'EXPENSE', 'Alimentação',   d(year, month, 20)),
    tx('Supermercado semanal',          395.00, 'EXPENSE', 'Alimentação',   d(year, month, 23)),

    // ── Transporte ────────────────────────────────────────────────────────
    tx('Combustível',                   280.00, 'EXPENSE', 'Transporte',    d(year, month, 3)),
    tx('Uber – semana',                  89.40, 'EXPENSE', 'Transporte',    d(year, month, 11)),
    tx('Manutenção do carro',           450.00, 'EXPENSE', 'Transporte',    d(year, month, 17)),
    tx('Estacionamento',                 35.00, 'EXPENSE', 'Transporte',    d(year, month, 22)),

    // ── Saúde ─────────────────────────────────────────────────────────────
    tx('Plano de saúde',                480.00, 'EXPENSE', 'Saúde',         d(year, month, 5)),
    tx('Consulta médica',               250.00, 'EXPENSE', 'Saúde',         d(year, month, 18)),

    // ── Lazer ─────────────────────────────────────────────────────────────
    tx('Netflix',                        55.90, 'EXPENSE', 'Lazer',         d(year, month, 1)),
    tx('Spotify',                        21.90, 'EXPENSE', 'Lazer',         d(year, month, 1)),
    tx('Cinema',                         80.00, 'EXPENSE', 'Lazer',         d(year, month, 13)),

    // ── Educação ──────────────────────────────────────────────────────────
    tx('Curso online – Udemy',           39.90, 'EXPENSE', 'Educação',      d(year, month, 6)),

    // ── Investimentos ─────────────────────────────────────────────────────
    tx('Aporte – Tesouro Direto',       500.00, 'EXPENSE', 'Investimentos', d(year, month, 7)),
  ]
}

// Extra transactions to make December fatter (Christmas / end-of-year)
function decemberExtras(year: number): TxDef[] {
  return [
    tx('13º salário',                  6800.00, 'INCOME',  'Salário',       d(year, 12, 10)),
    tx('Presente de Natal – família',   620.00, 'EXPENSE', 'Vestuário',     d(year, 12, 15)),
    tx('Ceia de Natal',                 340.00, 'EXPENSE', 'Alimentação',   d(year, 12, 24)),
    tx('Réveillon – festa',             280.00, 'EXPENSE', 'Lazer',         d(year, 12, 30)),
    tx('Roupas de verão',               430.00, 'EXPENSE', 'Vestuário',     d(year, 12, 18)),
    tx('Freelance – projeto e-commerce', 2200.00, 'INCOME', 'Freelance',    d(year, 12, 20)),
  ]
}

// Extra transactions for one month to push pages > 2 (needs > 20 rows)
function januaryExtras(year: number): TxDef[] {
  return [
    tx('IPVA',                          980.00, 'EXPENSE', 'Transporte',    d(year, 1, 8)),
    tx('IPTU – 1ª parcela',             420.00, 'EXPENSE', 'Moradia',       d(year, 1, 10)),
    tx('Academia – matrícula',          350.00, 'EXPENSE', 'Saúde',         d(year, 1, 4)),
    tx('Livros técnicos',               195.00, 'EXPENSE', 'Educação',      d(year, 1, 14)),
    tx('Tênis para corrida',            320.00, 'EXPENSE', 'Vestuário',     d(year, 1, 20)),
    tx('Bônus – projeto entregue',     2500.00, 'INCOME',  'Freelance',     d(year, 1, 28)),
  ]
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🌱 Iniciando seed...')

  // 1. Upsert seed user
  const salt = await bcrypt.genSalt(10)
  const hashed = await bcrypt.hash(SEED_PASSWORD, salt)

  const user = await prisma.user.upsert({
    where: { email: SEED_EMAIL },
    create: { email: SEED_EMAIL, name: SEED_NAME, password: hashed },
    update: {},
  })

  console.log(`✅ Usuário: ${user.email} (id: ${user.id})`)

  // 2. Clear existing data for this user
  await prisma.transaction.deleteMany({ where: { userId: user.id } })
  await prisma.category.deleteMany({ where: { userId: user.id } })
  console.log('🗑️  Dados anteriores removidos')

  // 3. Create categories
  const createdCats = await Promise.all(
    CATEGORIES.map((cat) => prisma.category.create({ data: { ...cat, userId: user.id } })),
  )

  const catByTitle = new Map(createdCats.map((c) => [c.title, c]))
  console.log(`✅ Categorias criadas: ${createdCats.length}`)

  // 4. Build transaction list (6 months: Nov 2025 → Apr 2026)
  const months: Array<[number, number]> = [
    [2025, 11],
    [2025, 12],
    [2026, 1],
    [2026, 2],
    [2026, 3],
    [2026, 4],
  ]

  const allTxDefs: TxDef[] = []
  for (const [year, month] of months) {
    allTxDefs.push(...monthTransactions(year, month))
  }
  allTxDefs.push(...decemberExtras(2025))
  allTxDefs.push(...januaryExtras(2026))

  // 5. Insert transactions
  let count = 0
  for (const def of allTxDefs) {
    const category = catByTitle.get(def.catKey)
    if (!category) {
      console.warn(`⚠️  Categoria não encontrada: ${def.catKey}`)
      continue
    }
    await prisma.transaction.create({
      data: {
        name: def.name,
        amount: def.amount,
        type: def.type,
        date: def.date,
        userId: user.id,
        categoryId: category.id,
      },
    })
    count++
  }

  console.log(`✅ Transações criadas: ${count}`)
  console.log('')
  console.log('─────────────────────────────────────────')
  console.log(`  Login de teste:`)
  console.log(`  E-mail:  ${SEED_EMAIL}`)
  console.log(`  Senha:   ${SEED_PASSWORD}`)
  console.log('─────────────────────────────────────────')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
