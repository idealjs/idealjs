import Link from "next/link";

export default function Navigation({
  pages,
}: {
  pages: { href: string; name: string }[];
}) {
  return (
    <div className="absolute z-10">
      {pages.map((page) => {
        return (
          <Link href={page.href} key={page.href}>
            {page.name}
          </Link>
        );
      })}
    </div>
  );
}
