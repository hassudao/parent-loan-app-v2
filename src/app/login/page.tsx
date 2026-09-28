'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase'; // パスをご自身の環境に合わせて調整してください

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // フォームのデフォルト送信（ページリロード）を防止
    setLoading(true);
    setError(null);

    try {
      console.log('ログイン処理を開始します:', email);

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        console.error('Supabase ログインエラー:', signInError);
        setError(`ログインエラー: ${signInError.message}`);
        return;
      }

      console.log('ログイン成功:', data);

      if (data.session) {
        console.log('ダッシュボードへ遷移します...');
        router.push('/');
        router.refresh();
      }
    } catch (err: any) {
      console.error('予期せぬエラーが発生しました:', err);
      setError('ログイン中に予期せぬエラーが発生しました。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl max-w-md w-full shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-100">おかえりなさい</h1>
          <p className="text-slate-400 text-sm mt-1">アカウントにログイン</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg text-sm mb-6 break-words">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
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
              placeholder="••••••••"
              className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-600 outline-none transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 font-semibold rounded-lg text-white transition duration-200 disabled:opacity-50 mt-2 shadow-lg shadow-blue-600/20"
          >
            {loading ? 'ログイン中...' : 'ログイン'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-400">
          アカウントをお持ちでないですか？{' '}
          <Link href="/signup" className="text-blue-400 hover:underline font-medium">
            新規登録
          </Link>
        </div>
      </div>
    </div>
  );
}