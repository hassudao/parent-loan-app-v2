'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('パスワードが一致しません');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // TODO: Supabase Auth の新規登録処理を呼び出す
      // const { error } = await supabase.auth.signUp({ email, password });
      // if (error) throw error;

      router.push('/');
    } catch (err: any) {
      setError(err.message || '登録に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl max-w-md w-full shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-100">アカウント作成</h1>
          <p className="text-slate-400 text-sm mt-1">親子間ローン管理をはじめましょう</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg text-sm mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              メールアドレス
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="example@example.com"
              className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-600 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              パスワード
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="8文字以上"
              className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-600 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              パスワード（確認）
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="パスワードを再入力"
              className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-600 outline-none transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 font-semibold rounded-lg text-white transition duration-200 disabled:opacity-50 mt-2 shadow-lg shadow-blue-600/20"
          >
            {loading ? '登録中...' : 'アカウントを作成'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-400">
          すでにアカウントをお持ちですか？{' '}
          <Link href="/login" className="text-blue-400 hover:underline font-medium">
            ログイン
          </Link>
        </div>
      </div>
    </div>
  );
}