export function Hero() {
  return (
    <section className="relative bg-gradient-to-r from-primary-900 via-primary-800 to-primary-700 py-12 md:py-20">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      
      <div className="container-custom relative z-10">
        <div className="text-center max-w-4xl mx-auto px-4">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 md:mb-6 leading-tight">
            Bienvenido a <span className="text-primary-400">JKAnime FLV</span>
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl text-gray-200 mb-6 md:mb-8 leading-relaxed">
            Ver anime online gratis en HD. La mejor plataforma para disfrutar 
            series y películas anime con subtítulos en español, latino y castellano.
          </p>
        </div>
      </div>
    </section>
  );
}