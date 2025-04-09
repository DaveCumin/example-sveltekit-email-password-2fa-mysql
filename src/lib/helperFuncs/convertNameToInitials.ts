export default function convertNameToInitials(username: string): string {
	const firstInitial = Array.from(username)[0];
	const words = username.trim().split(/\s+/);
	const lastword = words[words.length - 1];
	const lastInitial = lastword != words[0] ? Array.from(lastword)[0] : Array.from(username)[1];

	return `${firstInitial}${lastInitial}`;
}
