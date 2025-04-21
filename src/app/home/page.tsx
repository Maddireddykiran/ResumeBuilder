"use client";

export default function HomePage() {
  return (
    <section className="bg-gradient-to-r from-green-50 to-teal-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-24 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Welcome to Our Website
          </h2>
          <p className="mt-4 text-base text-gray-500">
            We're excited to have you here! We're here to help you with your needs.
          </p>
        </div>
        <div className="mt-10 inline-block rounded-lg bg-[#57CDA4] px-12 py-4 text-lg font-medium text-white shadow-sm transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 relative mx-auto">
          Get Started
        </div>
      </div>
    </section>
  );
}