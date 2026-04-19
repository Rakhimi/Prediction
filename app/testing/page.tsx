const page = async () => {
  const res = await fetch("http://localhost:3000/api/football-list", {
    cache: "no-store",
  });

  const data = await res.json();

  return (
    <div className="m-20 px-6">
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default page;