import Test from "@/components/test";
import { getCookie } from "@/utils/server/actions";

export default async function Home() {
	const config = JSON.parse((await getCookie("gameConfig")) || "{}");

	return (
		<div className='flex items-center justify-center min-w-screen min-h-screen max-md:py-8 max-md:px-6 max-md:m-4 font-mono p-20 leading-[1.6]'>
			<Test config={config} />
		</div>
	);
}
