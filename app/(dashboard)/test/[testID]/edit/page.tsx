/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

interface Test {
  id: number;
  title: string;
  description: string;
  duration_minutes: number;
  passing_score: number;
  total_points: number;
  status: string;
  randomize_questions: boolean;
  show_results_immediately: boolean;
  max_attempts: number;
}

interface Question {
  id?: number;
  question_type: string;
  question_text: string;
  points: number;
  order: number;
  options?: { text: string; is_correct: boolean }[];
  correct_answer?: string;
}

export default function EditTestPage() {
  const router = useRouter();
  const params = useParams();
  const testId = params?.id as string;
  
  const [test, setTest] = useState<Test | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (testId) {
      fetchTest();
    }
  }, [testId]);

  const fetchTest = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

      const response = await fetch(`${API_URL}/api/v1/test/${testId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true',
        },
      });

      if (!response.ok) throw new Error('Test topilmadi');

      const data = await response.json();
      setTest(data);
      setQuestions(data.questions || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateTest = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('access_token');
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

      const response = await fetch(`${API_URL}/api/v1/test/${testId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({
          title: test?.title,
          description: test?.description,
          duration_minutes: test?.duration_minutes,
          passing_score: test?.passing_score,
          randomize_questions: test?.randomize_questions,
          show_results_immediately: test?.show_results_immediately,
          max_attempts: test?.max_attempts,
          status: test?.status,
        }),
      });

      if (!response.ok) throw new Error('Yangilanmadi');

      setSuccess('Test muvaffaqiyatli yangilandi');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const addQuestion = async () => {
    const newQuestion: Question = {
      question_type: 'mcq',
      question_text: '',
      points: 1,
      order: questions.length,
      options: [
        { text: '', is_correct: false },
        { text: '', is_correct: false },
      ],
    };

    try {
      const token = localStorage.getItem('access_token');
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

      const response = await fetch(`${API_URL}/api/v1/test/${testId}/questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify(newQuestion),
      });

      if (!response.ok) throw new Error('Savol qo\'shilmadi');

      const data = await response.json();
      setQuestions([...questions, data]);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const updateQuestion = async (questionId: number, updatedData: Partial<Question>) => {
    try {
      const token = localStorage.getItem('access_token');
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

      const response = await fetch(`${API_URL}/api/v1/test/questions/${questionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) throw new Error('Savol yangilanmadi');

      const data = await response.json();
      setQuestions(questions.map(q => q.id === questionId ? data : q));
    } catch (err: any) {
      console.error('Update error:', err);
    }
  };

  const deleteQuestion = async (questionId?: number, index?: number) => {
    if (!questionId) {
      setQuestions(questions.filter((_, i) => i !== index));
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

      const response = await fetch(`${API_URL}/api/v1/test/questions/${questionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true',
        },
      });

      if (!response.ok) throw new Error('O\'chirilmadi');

      setQuestions(questions.filter(q => q.id !== questionId));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const publishTest = async () => {
    if (test) {
      setTest({ ...test, status: 'published' });
      await updateTest();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!test) return null;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Testni Tahrirlash</h1>
          <p className="text-gray-600 mt-1">{test.title}</p>
        </div>
        <div className="flex gap-2">
          {test.status === 'draft' && (
            <Button onClick={publishTest} className="bg-green-600 hover:bg-green-700">
              Nashr qilish
            </Button>
          )}
          {test.status === 'published' && (
            <Badge className="bg-green-600 text-lg px-4 py-2">Nashr qilingan</Badge>
          )}
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Test Sozlamalari</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Test nomi</Label>
            <Input
              id="title"
              value={test.title}
              onChange={(e) => setTest({ ...test, title: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Tavsif</Label>
            <textarea
              id="description"
              value={test.description}
              onChange={(e) => setTest({ ...test, description: e.target.value })}
              className="w-full p-2 border rounded-md min-h-25"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Vaqt (daqiqa)</Label>
              <Input
                id="duration"
                type="number"
                value={test.duration_minutes}
                onChange={(e) => setTest({ ...test, duration_minutes: parseInt(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="passing">O&apos;tish bali (%)</Label>
              <Input
                id="passing"
                type="number"
                value={test.passing_score}
                onChange={(e) => setTest({ ...test, passing_score: parseInt(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="attempts">Urinishlar</Label>
              <Input
                id="attempts"
                type="number"
                value={test.max_attempts}
                onChange={(e) => setTest({ ...test, max_attempts: parseInt(e.target.value) })}
              />
            </div>
          </div>

          <Button onClick={updateTest} disabled={saving}>
            {saving ? 'Saqlanmoqda...' : 'Sozlamalarni saqlash'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Savollar ({questions.length})</CardTitle>
            <Button onClick={addQuestion} size="sm">
              <PlusIcon className="h-4 w-4 mr-2" />
              Savol qo&apos;shish
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {questions.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              Hozircha savollar yo&apos;q
            </p>
          ) : (
            questions.map((question, index) => (
              <Card key={question.id || index} className="border-2">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">Savol {index + 1}</CardTitle>
                      <CardDescription>{question.question_type}</CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteQuestion(question.id, index)}
                    >
                      <TrashIcon className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{question.question_text || 'Savol matni yo\'q'}</p>
                  <div className="mt-2 flex gap-2 text-xs text-gray-600">
                    <span>{question.points} ball</span>
                    {question.options && (
                      <span>• {question.options.length} ta variant</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button variant="outline" onClick={() => router.push('/test')}>
          Orqaga
        </Button>
        <Button onClick={() => router.push(`/test/${testId}/results`)}>
          Natijalarni ko&apos;rish
        </Button>
      </div>
    </div>
  );
}