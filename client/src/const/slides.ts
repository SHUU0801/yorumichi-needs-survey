export interface Slide {
  id: number;
  title: string;
  subtitle?: string;
  content: string | React.ReactNode;
  type: 'title' | 'content' | 'survey';
  imageId?: string;
}

export const slides: Slide[] = [
  {
    id: 1,
    title: '夜道の「なんとなく怖い」をゼロにするプロジェクト',
    subtitle: 'YORUMICHI',
    content: '友人のつきまとい被害という実体験から始まった、安全な街づくりへの挑戦。',
    type: 'title',
    imageId: 'title-illustration',
  },
  {
    id: 2,
    title: '開発中のWebアプリ：ヨルミチ',
    content: `
      <div class="space-y-4">
        <p class="font-semibold text-lg text-blue-700">Googleマップ（最短経路）との違い</p>
        <p class="text-sm font-medium">ヨルミチは「最短距離」ではなく、「一番明るくて安全な道」を通って目的地へ着くことをゴールとしています！</p>
        <ul class="space-y-3">
          <li class="flex gap-3">
            <span class="font-bold text-blue-600">✓</span>
            <span>街灯の明るさや人通りをリアルタイム解析</span>
          </li>
          <li class="flex gap-3">
            <span class="font-bold text-blue-600">✓</span>
            <span>暗い道や死角を避けた「最安全ルート」を提案</span>
          </li>
          <li class="flex gap-3">
            <span class="font-bold text-blue-600">✓</span>
            <span>AIが毎日の安心な帰り道をナビゲート</span>
          </li>
        </ul>
        <div class="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <p class="text-sm font-bold text-yellow-800 text-center">✨ 今年中にアプリ化を予定しています！ ✨</p>
        </div>
      </div>
    `,
    type: 'content',
    imageId: 'app-illustration',
  },
  {
    id: 3,
    title: 'こういうデバイスを開発しようとしてます！',
    content: `
      <div class="space-y-4">
        <h3 class="font-bold text-lg">ヨルミチ・デバイス（エアタグサイズ）</h3>
        <p class="text-sm font-bold text-blue-700 bg-blue-50 p-2 rounded">
          【主観的】な不安を、【客観的】な事実にできるんです！
        </p>
        <div class="bg-gray-50 p-4 rounded">
          <p class="mb-3 font-semibold text-black">具体的な使用例</p>
          <ul class="space-y-3 text-sm">
            <li class="flex gap-2">
              <span class="font-bold text-red-500">①</span>
              <span><strong>警察への提出</strong>：つきまとい被害に遭ったときの「客観的な証拠」として提出</span>
            </li>
            <li class="flex gap-2">
              <span class="font-bold text-green-600">②</span>
              <span><strong>学校への提出</strong>：いじめ被害に遭ったときの「事実証明」として提出</span>
            </li>
            <li class="flex gap-2 pt-2 border-t border-gray-200 mt-2">
              <span class="text-gray-500">•</span>
              <span class="text-gray-600">デバイスが周囲の状況を自動スキャン＆録音し、言い逃れできない証拠を生成します</span>
            </li>
          </ul>
        </div>
        <p class="text-sm italic text-gray-600">カバンに入れるだけで、万が一のときの強力なお守りに</p>
      </div>
    `,
    type: 'content',
    imageId: 'device-illustration',
  },
  {
    id: 4,
    title: 'クーポン連動マップ：安全と特典の両立',
    content: `
      <div class="space-y-4">
        <p class="font-semibold text-lg text-blue-700">クーポン連動も計画中です！</p>
        <p class="text-sm text-gray-700">安全な道を歩くことで、地域のお店から特典をもらえる仕組みを予定しています。</p>
        <div class="bg-gray-50 p-4 rounded mt-3">
          <p class="mb-3 font-semibold text-black">想定しているクーポンの仕組み</p>
          <ul class="space-y-2 text-sm">
            <li class="flex gap-2">
              <span>•</span>
              <span>安全なルート上にある提携店舗を「セーフティスポット」に認定</span>
            </li>
            <li class="flex gap-2">
              <span>•</span>
              <span>ヨルミチアプリを使ってそこを通るだけで限定クーポンが届く</span>
            </li>
            <li class="flex gap-2">
              <span>•</span>
              <span>そのクーポンをお店で使える</span>
            </li>
          </ul>
        </div>
        <p class="text-sm italic text-gray-600 mt-4">安全な帰宅と、お得な特典が一緒に手に入る未来へ</p>
      </div>
    `,
    type: 'content',
    imageId: 'coupon-illustration',
  },
  {
    id: 5,
    title: '犯罪を未然に防ぐ未来へ',
    subtitle: 'ニーズ調査アンケート',
    content: 'survey',
    type: 'survey',
    imageId: 'survey-illustration',
  },
];
