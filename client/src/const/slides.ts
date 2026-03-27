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
        <p class="font-semibold text-lg">こういうアプリを開発してます！</p>
        <ul class="space-y-3">
          <li class="flex gap-3">
            <span class="font-bold">✓</span>
            <span>街灯の数や人通りをリアルタイムで解析</span>
          </li>
          <li class="flex gap-3">
            <span class="font-bold">✓</span>
            <span>暗い道や死角を避けた最安全ルートを提案</span>
          </li>
          <li class="flex gap-3">
            <span class="font-bold">✓</span>
            <span>AIが「一番安全な帰り道」を案内</span>
          </li>
        </ul>
        <p class="text-sm italic text-gray-600 mt-4">安全な帰宅をサポートするスマートナビゲーション</p>
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
        <p class="text-sm text-gray-700 mb-3">カバンに入れるだけで、あなたを守ります。</p>
        <div class="bg-gray-50 p-4 rounded">
          <p class="mb-3 font-semibold text-black">デバイスの特徴</p>
          <ul class="space-y-2 text-sm">
            <li class="flex gap-2">
              <span>•</span>
              <span><strong>小型・軽量</strong>：エアタグのようなコンパクトサイズ</span>
            </li>
            <li class="flex gap-2">
              <span>•</span>
              <span><strong>自動検知</strong>：付近に同じデバイスが継続して存在するかをスキャン</span>
            </li>
            <li class="flex gap-2">
              <span>•</span>
              <span><strong>証拠生成</strong>：警察に提出可能な客観的なログを自動生成</span>
            </li>
            <li class="flex gap-2">
              <span>•</span>
              <span><strong>自動録音</strong>：非常時に周囲の状況を記録</span>
            </li>
          </ul>
        </div>
        <p class="text-sm italic text-gray-600">つきまとい被害から身を守るための最新テクノロジー</p>
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
        <p class="font-semibold text-lg">ヨルミチアプリを使ってくれた人に、クーポンを配布します！</p>
        <div class="bg-gray-50 p-4 rounded mt-3">
          <p class="mb-3 font-semibold text-black">クーポンの仕組み</p>
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
        <p class="text-sm italic text-gray-600 mt-4">安全な帰宅と、お得な特典が一緒に手に入る</p>
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
