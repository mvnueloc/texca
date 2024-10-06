import logo from "../img/logo.png";

export default function Logo({ className }) {
  return (
    <img
      className={className}
      src={logo}
      alt="logo de la aplicacion"
    />
  );
}
