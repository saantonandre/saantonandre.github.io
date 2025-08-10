export const shorten = (address: string) => {
    if (address.length < 20) return address;
    return (
      address.slice(0, 4) +
      "..." +
      address.slice(address.length - 4, address.length)
    );
  };
  export default shorten