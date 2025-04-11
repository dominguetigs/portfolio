import { AUTHOR } from './constants';

export function AuthorLink() {
  const { name, url } = AUTHOR;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary font-semibold hover:underline hover:brightness-110 transition-all cursor-pointer"
    >
      {name}
    </a>
  );
}
