export default function Footer() {
  return (
    <footer className="col-[content-box] row-3 bg-footer w-full h-(--footer-height) flex items-center p-4">
      <p className="text-sm text-gray-500 leading-none">
        &copy; {new Date().getFullYear()} itsrekhab
      </p>
    </footer>
  );
}
