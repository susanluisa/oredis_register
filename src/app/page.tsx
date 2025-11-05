import LoginForm from "./Loginform";

export default function Home() {
  return (
    <div className="w-full h-svh bg-linear-to-bl from-white to-indigo-200 " >
      <main className="h-svh grid grid-cols-2">
        <div className="flex justify-center items-center " >
          <LoginForm />
        </div>
        <div className="m-4 fade-up" >
          <div className="relative h-full w-full flex items-center justify-center bg-[url('/loginBackground.jpg')] bg-cover bg-center bg-no-repeat rounded-4xl" ></div>
        </div>
      </main>
    </div>
  );
}
