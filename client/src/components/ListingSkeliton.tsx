const ListingSkeliton = () => {
  return (
    <div className="px-8 py-8 flex justify-between flex-wrap  md:justify-around max-md:justify-center ">
      {Array.from({ length: 6 }, (_, index) => (
        <div
          key={index}
          className="bg-slate-200 h-fit px-3 py-2 rounded-xl mt-6"
        >
          <div className="h-72 w-80 rounded-xl bg-slate-100 animate-pulse"></div>
          <div className="space-y-2 mt-2">
            <div className="h-4 w-[250px] bg-slate-100 rounded-xl animate-pulse"></div>
            <div className="h-4 w-[250px] bg-slate-100 rounded-xl animate-pulse"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ListingSkeliton;
