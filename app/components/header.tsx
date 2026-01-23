"use client";
import { signOut, useSession } from "@/lib/auth-client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	navigationMenuTriggerStyle,
} from "./ui/navigation-menu";
import { Button } from "./ui/button";
import AccountDropdown from "./account-dropdown";

const Header = () => {
	const pathname = usePathname();
	const { data: session, isPending } = useSession();

	return (
		<NavigationMenu className='min-w-screen w-full h-20 bg-background border-b-2 border-accent justify-between px-4 shadow-xl'>
			<div className='flex h-16 max-w-7xl items-center gap-8 px-4 sm:px-6 lg:px-8'>
				<h1 className='block text-primary font-bold text-2xl'>Typing Test</h1>
			</div>
			<NavigationMenuList>
				<NavigationMenuItem>
					<NavigationMenuLink
						asChild
						active={pathname === "/"}
						className={navigationMenuTriggerStyle()}
					>
						<Link href='/' className='text-xl data-active:bg-accent'>
							Home
						</Link>
					</NavigationMenuLink>
				</NavigationMenuItem>

				<NavigationMenuItem>
					<NavigationMenuLink
						asChild
						active={pathname === "/stats"}
						className={navigationMenuTriggerStyle()}
					>
						<Link href='/stats' className='text-xl'>
							Stats
						</Link>
					</NavigationMenuLink>
				</NavigationMenuItem>
			</NavigationMenuList>

			{session?.user.id && !isPending ? (
				<NavigationMenuList className='flex-wrap px-8'>
					<NavigationMenuItem>
						<NavigationMenuLink asChild>
							<AccountDropdown
								name={session?.user.name}
								email={session?.user.email}
							/>
						</NavigationMenuLink>
					</NavigationMenuItem>

					<NavigationMenuItem>
						<NavigationMenuLink asChild>
							<Button
								className='text-lg p-3'
								onClick={() => signOut()}
								variant='destructive'
							>
								Logout
							</Button>
						</NavigationMenuLink>
					</NavigationMenuItem>
				</NavigationMenuList>
			) : (
				<NavigationMenuList className='flex-wrap px-8'>
					<NavigationMenuItem>
						<NavigationMenuLink asChild>
							<Button className='text-lg p-3'>
								<Link href='/sign-in'>Login</Link>
							</Button>
						</NavigationMenuLink>
					</NavigationMenuItem>

					<NavigationMenuItem>
						<NavigationMenuLink asChild>
							<Button className='text-lg p-3'>
								<Link href='/sign-up'>Register</Link>
							</Button>
						</NavigationMenuLink>
					</NavigationMenuItem>
				</NavigationMenuList>
			)}
		</NavigationMenu>
	);
};

export default Header;
