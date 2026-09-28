'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { logout } from './login/actions'
import {
  LogOut,
  Plus,
  Trash2,
  Wallet,
  Calendar,
  PlusCircle,
} from 'lucide-react'

type Loan = {
  id: string
  title: string
  total_amount: number
  paid_amount: number
  created_at: string
}

type Transaction = {
  id: string
  loan_id: string
  amount: number
  type: 'repayment' | 'additional'
  created_at: string
}

export default function DashboardClient({
  user,
  initialLoans,
  initialTransactions,
}: {
  user: any
  initialLoans: Loan[]
  initialTransactions: Transaction[]
}) {
  const [loans, setLoans] = useState<Loan[]>(initialLoans)
  const [selectedLoanId, setSelectedLoanId] = useState<string>(
    initialLoans[0]?.id || ''
  )
  const [showNewModal, setShowNewModal] = useState(false)
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')

  const supabase = createClient()

  // 集計
  const totalLoanAmount = loans.reduce((acc, curr) => acc + (curr.total_amount ?? 0), 0)
  const totalPaidAmount = loans.reduce((acc, curr) => acc + (curr.paid_amount ?? 0), 0)
  const remainingTotal = totalLoanAmount - totalPaidAmount
  const overallProgress = totalLoanAmount > 0 ? Math.round((totalPaidAmount / totalLoanAmount) * 100) : 0

  // 選択中のローン
  const selectedLoan = loans.find((l) => l.id === selectedLoanId) || loans[0]

  // 新規件数作成
  const handleCreateLoan = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !amount) return

    const { data, error } = await supabase
      .from('loans')
      .insert([
        {
          title,
          total_amount: Number(amount),
          paid_amount: 0,
          user_id: user.id,
        },
      ])
      .select()

    if (error) {
      alert('エラーが発生しました: ' + error.message)
      return
    }

    if (data) {
      setLoans([data[0], ...loans])
      setSelectedLoanId(data[0].id)
      setTitle('')
      setAmount('')
      setShowNewModal(false)
    }
  }

  // 削除
  const handleDeleteLoan = async (id: string) => {
    if (!confirm('この借入件数を削除しますか？')) return

    const { error } = await supabase.from('loans').delete().eq('id', id)

    if (error) {
      alert('削除に失敗しました: ' + error.message)
      return
    }

    const updated = loans.filter((loan) => loan.id !== id)
    setLoans(updated)
    if (updated.length > 0) {
      setSelectedLoanId(updated[0].id)
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans pb-12">
      {/* ヘッダー */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-slate-900 leading-tight">親子収支管理</h1>
              <p className="text-xs text-slate-400">{user?.email}</p>
            </div>
          </div>

          <button
            onClick={() => logout()}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 px-3 py-2 rounded-lg hover:bg-slate-100 transition"
          >
            <LogOut className="w-4 h-4" />
            ログアウト
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 mt-8 space-y-6">
        {/* ダークサマリーカード */}
        <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div>
              <span className="inline-block bg-slate-800/80 text-slate-300 text-xs px-3 py-1 rounded-full mb-3">
                全借入の総合計
              </span>
              <div className="text-3xl md:text-4xl font-extrabold tracking-tight">
                総残り残高 <span className="text-white ml-2">¥{remainingTotal.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={() => setShowNewModal(!showNewModal)}
              className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold px-5 py-3 rounded-xl shadow-lg shadow-blue-600/30 flex items-center gap-2 transition active:scale-95"
            >
              <Plus className="w-4 h-4" />
              新しい借入用件を追加
            </button>
          </div>

          {/* 全体進捗バー */}
          <div className="space-y-2 mb-8">
            <div className="flex justify-between text-xs text-slate-400">
              <span>全体の返済達成率</span>
              <span className="font-bold text-blue-400">{overallProgress}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-blue-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          </div>

          {/* サマリー数値 */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800 text-xs text-slate-400">
            <div>
              <div className="mb-1">全借入総額</div>
              <div className="text-base font-bold text-white">¥{totalLoanAmount.toLocaleString()}</div>
            </div>
            <div>
              <div className="mb-1">全返済済み合計</div>
              <div className="text-base font-bold text-emerald-400">¥{totalPaidAmount.toLocaleString()}</div>
            </div>
            <div>
              <div className="mb-1">登録用件数</div>
              <div className="text-base font-bold text-white">{loans.length} 件</div>
            </div>
          </div>
        </div>

        {/* 新規作成アコーディオン/フォーム */}
        {showNewModal && (
          <form onSubmit={handleCreateLoan} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-3">
            <input
              type="text"
              placeholder="用件名 (例: ガソリン代)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="number"
              placeholder="金額 (円)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full md:w-48 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition"
            >
              保存する
            </button>
          </form>
        )}

        {/* タブ一覧 */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
          {loans.map((loan) => {
            const isSelected = selectedLoan?.id === loan.id
            return (
              <button
                key={loan.id}
                onClick={() => setSelectedLoanId(loan.id)}
                className={`px-5 py-3 rounded-2xl font-bold text-sm transition shadow-sm whitespace-nowrap ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-blue-500/20'
                    : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                }`}
              >
                {loan.title}
              </button>
            )
          })}
        </div>

        {/* 選択中の用件詳細カード */}
        {selectedLoan && (
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full mb-2 inline-block">
                  選択中の用件
                </span>
                <h2 className="text-2xl font-extrabold text-slate-900">{selectedLoan.title}</h2>
                <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                  <Calendar className="w-3.5 h-3.5" />
                  借りた日: {new Date(selectedLoan.created_at).toLocaleDateString('ja-JP')}
                </div>
              </div>

              <div className="flex gap-3 w-full md:w-auto">
                <button
                  onClick={() => handleDeleteLoan(selectedLoan.id)}
                  className="flex-1 md:flex-initial border border-rose-200 text-rose-500 hover:bg-rose-50 px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
                >
                  <Trash2 className="w-4 h-4" />
                  用件を削除
                </button>
                <button
                  onClick={() => alert('返済・借入記録機能')}
                  className="flex-1 md:flex-initial bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-600/20"
                >
                  <PlusCircle className="w-4 h-4" />
                  返済・借入を記録
                </button>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex justify-between items-end">
              <div className="text-2xl font-extrabold text-slate-900">
  ¥{((selectedLoan.total_amount ?? 0) - (selectedLoan.paid_amount ?? 0)).toLocaleString()}
</div>
<div className="text-xs text-slate-500 font-medium">
  残り ¥{((selectedLoan.total_amount ?? 0) - (selectedLoan.paid_amount ?? 0)).toLocaleString()} / 元金 ¥{(selectedLoan.total_amount ?? 0).toLocaleString()}
</div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}