function convertGradToRadian(deg) {
  return Number(((deg / 180) * Math.PI).toFixed(4));
}

function convertRadianToGrad(rad) {
  return Number(((rad * 180) / Math.PI).toFixed());
}
