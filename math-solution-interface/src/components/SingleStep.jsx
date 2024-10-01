function SingleStep({ description, expression }) {
  return (
    <div className="w-full p-2 border-2 rounded-xl m-2">
      <div>
        <span className="font-bold">Description: </span>
        {description}
      </div>
      <div>
        <span className="font-bold">Expression: </span> {expression}
      </div>
    </div>
  );
}

export default SingleStep;
