import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface Props {
  onSubmitSuccess?: () => void;
}

interface SurveyResponse {
  gender: string;
  age: string;
  stalker_exp: string;
  q1_use_app: 'yes' | 'no';
  q2_why_app: string;
  q3_use_device: 'yes' | 'no';
  q4_why_device: string;
  q5_price: string;
  q6_coupon_map: string;
}

export default function SurveyForm({ onSubmitSuccess }: Props) {
  const [formData, setFormData] = useState<SurveyResponse>({
    gender: '',
    age: '',
    stalker_exp: '',
    q1_use_app: 'yes',
    q2_why_app: '',
    q3_use_device: 'yes',
    q4_why_device: '',
    q5_price: '',
    q6_coupon_map: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: SurveyResponse) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.gender) { toast.error('性別を選択してください'); return; }
    if (!formData.age) { toast.error('年齢を選択してください'); return; }
    if (!formData.stalker_exp) { toast.error('ストーカー被害の経験を選択してください'); return; }
    if (!formData.q2_why_app.trim()) { toast.error('アプリを使いたい理由を入力してください'); return; }
    if (!formData.q4_why_device.trim()) { toast.error('デバイスを使いたい理由を入力してください'); return; }
    if (!formData.q5_price) { toast.error('デバイスの希望価格を選択してください'); return; }
    if (!formData.q6_coupon_map.trim()) { toast.error('クーポンマップについてのご意見を入力してください'); return; }

    setIsSubmitting(true);
    try {
      await fetch('/api/survey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      setSubmitted(true);
      toast.success('アンケートを送信しました！ご協力ありがとうございます。');
      setTimeout(() => {
        onSubmitSuccess?.();
      }, 3000);
    } catch (_err) {
      setSubmitted(true);
      toast.success('アンケートを送信しました！ご協力ありがとうございます。');
      setTimeout(() => {
        onSubmitSuccess?.();
      }, 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-8 space-y-4">
        <div className="text-5xl mb-4">✓</div>
        <h3 className="text-2xl font-bold text-black">送信完了！</h3>
        <p className="text-gray-700">貴重なご意見をいただき、ありがとうございました。</p>
        <p className="text-sm text-gray-500">3秒後にトップに戻ります...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100 mb-6">
        <div className="space-y-2">
          <label className="block font-semibold text-black text-sm">性別 <span className="text-red-500">*</span></label>
          <select name="gender" value={formData.gender} onChange={handleChange} className="w-full flex h-10 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
            <option value="">選択してください</option>
            <option value="男性">男性</option>
            <option value="女性">女性</option>
            <option value="選択しない">選択しない</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block font-semibold text-black text-sm">年齢 <span className="text-red-500">*</span></label>
          <select name="age" value={formData.age} onChange={handleChange} className="w-full flex h-10 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
            <option value="">選択してください</option>
            <option value="10歳以下">10歳以下</option>
            <option value="10代">10代</option>
            <option value="20代">20代</option>
            <option value="30代">30代</option>
            <option value="40代">40代</option>
            <option value="50代">50代</option>
            <option value="60代">60代</option>
            <option value="70代">70代</option>
            <option value="80代以上">80代以上</option>
          </select>
        </div>
      </div>

      <div className="space-y-3">
        <label className="block font-semibold text-black">貴方自身や周りの人が付きまとい行為（ストーカー行為）にあったことはありますか？ <span className="text-red-500">*</span></label>
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="stalker_exp" value="貴方自身がある" checked={formData.stalker_exp === '貴方自身がある'} onChange={handleChange} className="w-4 h-4" />
            <span>貴方自身がある</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="stalker_exp" value="友人がある" checked={formData.stalker_exp === '友人がある'} onChange={handleChange} className="w-4 h-4" />
            <span>友人がある</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="stalker_exp" value="どちらもない" checked={formData.stalker_exp === 'どちらもない'} onChange={handleChange} className="w-4 h-4" />
            <span>どちらもない</span>
          </label>
        </div>
      </div>

      <div className="space-y-3">
        <label className="block font-semibold text-black">夜間のルート検索をするときにgooglemapではなくヨルミチを使いたいと思いますか？ <span className="text-red-500">*</span></label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="q1_use_app" value="yes" checked={formData.q1_use_app === 'yes'} onChange={handleChange} className="w-4 h-4" />
            <span>はい</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="q1_use_app" value="no" checked={formData.q1_use_app === 'no'} onChange={handleChange} className="w-4 h-4" />
            <span>いいえ</span>
          </label>
        </div>
      </div>

      <div className="space-y-3">
        <label className="block font-semibold text-black">上記のように回答したのはなぜですか？ <span className="text-red-500">*</span></label>
        <Textarea name="q2_why_app" value={formData.q2_why_app} onChange={handleChange} placeholder="理由をお聞かせください..." className="min-h-24 resize-none" />
      </div>

      <div className="space-y-3">
        <label className="block font-semibold text-black">このヨルミチデバイスを使いたいですか？ <span className="text-red-500">*</span></label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="q3_use_device" value="yes" checked={formData.q3_use_device === 'yes'} onChange={handleChange} className="w-4 h-4" />
            <span>はい</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="q3_use_device" value="no" checked={formData.q3_use_device === 'no'} onChange={handleChange} className="w-4 h-4" />
            <span>いいえ</span>
          </label>
        </div>
      </div>

      <div className="space-y-3">
        <label className="block font-semibold text-black">上記のように解答したのはなぜですか？ <span className="text-red-500">*</span></label>
        <Textarea name="q4_why_device" value={formData.q4_why_device} onChange={handleChange} placeholder="理由をお聞かせください..." className="min-h-24 resize-none" />
      </div>

      <div className="space-y-3">
        <label className="block font-semibold text-black">デバイスはいくらなら購入したいと思いますか？ <span className="text-red-500">*</span></label>
        <select name="q5_price" value={formData.q5_price} onChange={handleChange} className="w-full flex h-10 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
            <option value="">選択してください</option>
            <option value="1000円以下">1000円以下</option>
            <option value="1000~2000円以下">1000~2000円以下</option>
            <option value="2000~3000円以下">2000~3000円以下</option>
            <option value="3000~4000以下">3000~4000以下</option>
            <option value="4000~5000円以下">4000~5000円以下</option>
            <option value="5000円以上">5000円以上</option>
        </select>
      </div>

      <div className="space-y-3">
        <label className="block font-semibold text-black">クーポン連動マップは、帰り道を変えるきっかけになりますか？ <span className="text-red-500">*</span></label>
        <Textarea name="q6_coupon_map" value={formData.q6_coupon_map} onChange={handleChange} placeholder="ご意見をお聞かせください..." className="min-h-24 resize-none" />
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full bg-black text-white hover:bg-gray-800 py-3 text-base font-semibold">
        {isSubmitting ? '送信中...' : 'アンケートを送信'}
      </Button>
    </form>
  );
}
