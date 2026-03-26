import UserSidebar from "./UserSidebar";
import UserTopbar from "./UserTopbar";

export default function UserLayoutShell({ children }: { children: React.ReactNode }) {
	return (
		<div className="min-h-screen flex bg-gray-50">
			<UserSidebar />
			<div className="flex-1 flex flex-col">
				<UserTopbar />
				<main className="flex-1 p-8">
					{children}
				</main>
			</div>
		</div>
	);
}