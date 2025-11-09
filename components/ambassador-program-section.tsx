import React from 'react';

interface AmbassadorProgramSectionProps {
  // Define any necessary props here if the design needs to be dynamic
}

export default function AmbassadorProgramSection({}: AmbassadorProgramSectionProps) {
  const imageUrl = "https://studynt.nt.gov.au/sites/default/files/styles/1920x500/public/uploads/images/2023/dsc00704_0.jpg?h=deaf907f&itok=N26g7MWf";

  return (
    <section className="relative overflow-hidden bg-white pt-[309.385px] pb-[176px]">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${imageUrl})` }}
      />
      <div className="mx-auto max-w-[1236px] px-3 w-full relative">
        <div className="text-center">
          <h1 className="text-white font-bold relative text-[48.5954px] leading-[58.3145px] mb-6 mt-4">
            Ambassador program
          </h1>
        </div>
      </div>
    </section>
  );
}
