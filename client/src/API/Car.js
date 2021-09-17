/**
 * Information about a car
 */
class Car {

  constructor(id,category, brand, model)
  {
      this.id = id; 
      this.category = category;
      this.brand = brand; 
      this.model = model; 

  }

  /**
   * Construct a Car from a plain object
   * @param {{}} json  //json has a Object default prototype
   * @return {Task} the newly created Car object
   */
  static from(json) {
    return Object.assign(new Car(json.id, json.category, json.brand, json.model), json); //in this way we assign to json default prototype Object Exam prototype
                                           
  }
}

export default Car;
