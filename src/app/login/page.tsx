'use client';

import React from 'react';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl max-w-md w-full shadow-xl">
        <h1 className="text-2xl font-bold mb-4 text-center">ログイン</h1>
        <p className="text-slate-400 text-sm mb-6 text-center">
          親子間ローン管理アプリへアクセスするにはログインが必要です。
        </p>
        {/* Supabase Auth のログインフォームやボタンを配置 */}
        <button
          onClick={() => alert('ログイン処理をここに実装')}
          className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold transition text-white"
        >
          ログインする
        </button>
      </div>
    </div>
  );
}