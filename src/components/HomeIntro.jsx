export default function HomeIntro() {
    return (
        <main className="pt-16 flex flex-col items-center text-center px-4 max-w-2xl mx-auto">
            {/* タイトル */}
            <div className="flex flex-col items-center justify-center gap-3 mb-6">
                {/* ファビコン（常に表示） */}
                <img
                    src="/tf-favicon.png"
                    alt="エンタメフロート アイコン"
                    className="h-24 w-24"
                />

                {/* スマホ用ロゴ */}
                <img
                    src="/images/lp/tf-font2.png"
                    alt="エンタメフロート ロゴ（縦型）"
                    className="h-48 md:hidden"
                />

                {/* PC用ロゴ */}
                <img
                    src="/images/lp/tf-font12.png"
                    alt="エンタメフロート ロゴ（横型）"
                    className="hidden md:block h-40"
                />
            </div>

            <p className="text-lg mb-12">～エンタメ特化のメモ共有アプリ～</p>

            {/* キャッチコピー */}
            <p className="mt-2 text-base">
                最近読んだ本の内容を思い出せますか？
                <br />
                最後に見た映画を思い出せますか？
            </p>
            <p className="mt-12 text-base">
                触れた瞬間の楽しさも素敵だけど、
                <br />
                その楽しさを、いつでも思い出せるように。
            </p>
            <p className="mt-12 text-base">
                自分は何が好きか、覚えておけるように。
            </p>
            <p className="mt-12 text-base">
                そしてそれを適度な距離感でつないでいく。
            </p>
            <p className="mt-12 mb-12 text-base">
                そんなアプリをつくりました。
            </p>

            {/* 図①プレースホルダー */}

            <div className="flex items-center justify-center gap-3 mb-6">
                <img
                    src="/tf-favicon.png"
                    alt="エンタメフロート アイコン"
                    className="h-24 w-24"
                />
            </div>

            {/* 使い方 */}
            <h2 className="text-2xl font-semibold mt-8 mb-12">使い方</h2>

            {/* １メモとして */}
            <h3 className="text-xl font-medium mb-2">１. メモとして</h3>

            <p className="mt-8 text-base">
                ふれたエンタメを記録して、そのエンタメに
                <br />
                何度も、そしていろんな箇所に感想を追加できます。
            </p>

            <p className="mt-12 mb-8 text-base">
                また「どんなときに振り返りたいか」の
                <br />
                タグをつけることもできます。
            </p>
            <div className="my-6 w-full h-48 bg-gray-200 flex items-center justify-center rounded">
                <span className="text-gray-600">（実際の画面のスクショ）</span>
            </div>
            <p className="text-base mt-12 mb-16">
                せわしない現代社会の中、
                <br />
                「雨宿りに丁度いい場所」ぐらいの気分で
                <br />
                気軽にエンタメに触れて記録してください！
            </p>

            <div className="flex items-center justify-center gap-3 mb-12">
                <img
                    src="/tf-rogo12.png"
                    alt="エンタメフロート アイコン"
                    className="h-48 w-48"
                />
            </div>

            {/* ２タグで共有 */}
            <h3 className="text-xl font-medium mb-8">２. タグで共有</h3>
            <p className="text-base">
                振り返りのタグをつけたエンタメは共有されます。
            </p>

            <p className="mt-8 text-base">
                他のユーザはタグを検索して、
                <br />
                自分の気分にぴったりな
                <br />
                エンタメを探すことができます。
            </p>

            <p className="mt-12 text-base">
                ただし
                <br />
                だれが投稿したか表示されません。
                <br />
                いいね、もありません。
                <br />
                そもそもフォローもありません。
            </p>
            <p className="mt-12 text-base mb-4">
                承認欲求を気にせず、
                <br />
                本当に好きなものを共有してください！
            </p>
            <div className="my-6 w-full h-48 bg-gray-200 flex items-center justify-center rounded">
                <span className="text-gray-600">（実際のスクショ）</span>
            </div>
            <p className="text-base mt-12 mb-8">
                素敵なエンタメに出会ったら、
                <br />
                ぜひ他のユーザにシェアを！！
            </p>

            {/* 図②プレースホルダー */}
            <div className="flex items-center justify-center gap-3 mb-6">
                <img
                    src="/tf-rogo2.png"
                    alt="エンタメフロート アイコン"
                    className="h-60 w-60"
                />
            </div>

            {/* CTAボタン */}
            <div className="mt-8 mb-20 flex flex-col sm:flex-row gap-4">
                <a href="/register" className="text-gray-700 underline">
                    新規登録はこちら
                </a>
                <a href="/login" className="text-gray-700 underline">
                    ログインはこちら
                </a>
            </div>
        </main>
    )
}
