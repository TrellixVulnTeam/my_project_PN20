var modeler = {};
//比较数组是否相同
modeler.compArray = function (array1, array2) {
  if (
    array1 &&
    typeof array1 === "object" &&
    array1.constructor === Array &&
    array2 &&
    typeof array2 === "object" &&
    array2.constructor === Array
  ) {
    if (array1.length == array2.length) {
      for (var i = 0; i < array1.length; i++) {
        var ggg = modeler.compObj(array1[i], array2[i]);
        if (!ggg) {
          return false;
        }
      }
    } else {
      return false;
    }
  } else {
    throw new Error("argunment is  error ;");
  }
  return true;
};

//比较两个对象是否相等
modeler.compObj = function (obj1, obj2) {
  if (
    obj1 &&
    typeof obj1 === "object" &&
    !(obj1.constructor == Array) &&
    obj2 &&
    typeof obj2 === "object" &&
    !(obj2.constructor == Array)
  ) {
    var count1 = modeler.propertyLength(obj1);
    var count2 = modeler.propertyLength(obj2);
    if (count1 == count2) {
      for (var ob in obj1) {
        if (
          Object.prototype.hasOwnProperty.call(obj1, ob) &&
          Object.prototype.hasOwnProperty.call(obj2, ob)
        ) {
          if (obj1[ob].constructor == Array && obj2[ob].constructor == Array) {
            // 如果属性是数组
            if (!modeler.compArray(obj1[ob], obj2[ob])) {
              return false;
            }
          } else if (
            typeof obj1[ob] === "object" &&
            typeof obj2[ob] === "object"
          ) {
            //属性是对象
            if (!modeler.compObj(obj1[ob], obj2[ob])) {
              return false;
            }
          } else if (
            obj1[ob] &&
            obj2[ob] &&
            typeof obj1[ob] === typeof obj2[ob]
          ) {
            //纯属性
            if (obj1[ob] !== obj2[ob]) {
              return false;
            }
          } else {
            return false;
          }
        } else {
          return false;
        }
      }
    } else {
      return false;
    }
  } else if (
    obj1 &&
    obj1.constructor == Array &&
    obj2 &&
    obj2.constructor == Array
  ) {
    if (!modeler.compArray(obj1, obj2)) {
      return false;
    }
  } else if (obj1 && obj2) {
    return obj1 === obj2;
  } else {
    return false;
  }
  return true;
};

//获得对象上的属性个数
modeler.propertyLength = function (obj) {
  var count = 0;
  if (obj && typeof obj === "object") {
    for (var ooo in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, ooo)) {
        count++;
      }
    }
    return count;
  } else {
    throw new Error("argunment can not be null;");
  }
};
