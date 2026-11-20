// Anchor that routes internal paths ("/...") through react-router and leaves
// in-page anchors ("#...") and external URLs to the browser.
export default function LandingLink({ to, navigate, onClick, children, ...rest }) {
  const internal = navigate && typeof to === 'string' && to.startsWith('/');
  const handleClick = (event) => {
    onClick?.(event);
    if (internal && !event.defaultPrevented) {
      event.preventDefault();
      navigate(to);
    }
  };
  return <a href={to} onClick={handleClick} {...rest}>{children}</a>;
}
