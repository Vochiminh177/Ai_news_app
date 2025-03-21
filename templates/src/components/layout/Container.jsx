import clsx from "clsx";

const Container = ({ children, className }) => {
  return (
    <div className={clsx("w-full px-3 py-2", className)}>
      <div className="w-full lg:max-w-[1180px] bg-transparent mx-auto">
        {children}
      </div>
    </div>
  );
};

export default Container;
