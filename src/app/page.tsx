import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import DashboardClient from './dashboard-client'

export default async function Page() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // ローン（借金・貸出）データの取得
  const { data: loans } = await supabase
    .from('loans')
    .select('*')
    .order('created_at', { ascending: false })

  // 取引履歴データの取得
  const { data: transactions } = await supabase
    .from('transactions')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <DashboardClient
      user={user}
      initialLoans={loans || []}
      initialTransactions={transactions || []}
    />
  )
}