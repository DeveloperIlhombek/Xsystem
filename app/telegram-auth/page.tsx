/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getTelegramWebApp, getTelegramUser, getTelegramInitData, initTelegramWebApp } from '@/lib/telegram';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function TelegramAuthPage() {
  const router = useRouter();
  const { user, loading: authLoading, telegramAuth } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [telegramUser, setTelegramUser] = useState<any>(null);
  const [isTelegramApp, setIsTelegramApp] = useState(false);

  useEffect(() => {
    // Check if running in Telegram
    const webApp = getTelegramWebApp();
    if (webApp) {
      initTelegramWebApp();
      setIsTelegramApp(true);
      
      const tgUser = getTelegramUser();
      setTelegramUser(tgUser);
      
      // Auto login if user is already authenticated
      if (!authLoading && !user && tgUser) {
        handleTelegramLogin();
      }
    } else {
      setIsTelegramApp(false);
    }
  }, [authLoading, user]);

  useEffect(() => {
    if (!authLoading && user) {
      router.push('/dashboard');
    }
  }, [user, authLoading, router]);

  const handleTelegramLogin = async () => {
    setError('');
    setLoading(true);

    try {
      const initData = getTelegramInitData();
      
      if (!initData) {
        throw new Error('Telegram init data topilmadi');
      }

      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      
      const response = await fetch(`${API_URL}/api/v1/auth/telegram/mini-app`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({ init_data: initData }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Telegram auth failed');
      }

      const data = await response.json();
      
      // Save tokens
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
      
      // Fetch user data
      const userRes = await fetch(`${API_URL}/api/v1/auth/me`, {
        headers: {
          Authorization: `Bearer ${data.access_token}`,
          'ngrok-skip-browser-warning': 'true',
        },
      });
      
      if (userRes.ok) {
        const userData = await userRes.json();
        
        // Use AuthContext to set user
        await telegramAuth({
          telegram_id: userData.telegram_id,
          username: userData.username,
          full_name: userData.full_name,
        });
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setError('');
    setLoading(true);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      
      const response = await fetch(`${API_URL}/api/v1/auth/telegram/demo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
      });

      if (!response.ok) {
        throw new Error('Demo auth failed');
      }

      const data = await response.json();
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
      
      const userRes = await fetch(`${API_URL}/api/v1/auth/me`, {
        headers: {
          Authorization: `Bearer ${data.access_token}`,
          'ngrok-skip-browser-warning': 'true',
        },
      });
      
      if (userRes.ok) {
        const userData = await userRes.json();
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            {isTelegramApp ? '🚀 Telegram Mini App' : '⚠️ Telegram da ochilmagan'}
          </CardTitle>
          <CardDescription className="text-center">
            {isTelegramApp 
              ? 'Telegram orqali avtomatik kirish' 
              : 'Ushbu sahifa faqat Telegram ichida ochilishi kerak'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isTelegramApp ? (
            <>
              {telegramUser && (
                <div className="p-4 bg-blue-50 rounded-lg space-y-2">
                  <p className="text-sm font-medium text-gray-700">Telegram User:</p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">ID:</span> {telegramUser.id}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Ism:</span> {telegramUser.first_name} {telegramUser.last_name}
                  </p>
                  {telegramUser.username && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Username:</span> @{telegramUser.username}
                    </p>
                  )}
                </div>
              )}

              <Button 
                onClick={handleTelegramLogin} 
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Yuklanmoqda...' : '✅ Telegram orqali kirish'}
              </Button>

              <div className="text-center text-sm text-gray-500">
                <p>Avtomatik ro&apos;yxatdan o&apos;tish va kirish</p>
              </div>
            </>
          ) : (
            <>
              <div className="p-4 bg-yellow-50 rounded-lg">
                <p className="text-sm text-yellow-800">
                  Bu sahifa Telegram Mini App sifatida ochilishi kerak.
                </p>
                <p className="text-xs text-yellow-700 mt-2">
                  Telegram bot orqali /start buyrug&apos;ini yuboring.
                </p>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">yoki</span>
                </div>
              </div>

              <Button 
                onClick={handleDemoLogin} 
                disabled={loading}
                variant="outline"
                className="w-full"
              >
                {loading ? 'Yuklanmoqda...' : '🧪 Demo Login (Test)'}
              </Button>

              <div className="text-center">
                <Button
                  variant="link"
                  onClick={() => router.push('/login')}
                  className="text-sm"
                >
                  ← Oddiy login sahifasiga qaytish
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}