import ChatWidget from "@/components/ChatWidget";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 to-white">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-6 py-24 text-center">
        <div className="inline-block bg-indigo-100 text-indigo-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
          B2B E-Ticaret Analitiği
        </div>

        <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
          E-ticaret verinizi <span className="text-indigo-600">anlayan</span>{" "}
          analitik platformu
        </h1>

        <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
          NextReach ile sipariş trendlerini, müşteri davranışlarını ve envanter
          performansını tek dashboard'dan takip edin.
        </p>

        <div className="flex gap-4 justify-center">
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-full font-medium transition">
            Demo İste
          </button>
          <button className="border border-gray-300 hover:border-indigo-400 text-gray-700 px-8 py-3 rounded-full font-medium transition">
            Nasıl Çalışır?
          </button>
        </div>

        {/* Fake stats */}
        <div className="grid grid-cols-3 gap-8 mt-20 max-w-2xl mx-auto">
          <div>
            <p className="text-3xl font-bold text-indigo-600">500+</p>
            <p className="text-gray-500 text-sm mt-1">Aktif Müşteri</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-indigo-600">%34</p>
            <p className="text-gray-500 text-sm mt-1">Ortalama Büyüme</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-indigo-600">7/24</p>
            <p className="text-gray-500 text-sm mt-1">Destek</p>
          </div>
        </div>
      </div>

      <ChatWidget />
    </main>
  );
}
