/**
 * Information about a car Rent
 */
class Rent {

  constructor(id,cat,km, n_days, start,end,age,extra_driver, extra_ins,username,vehicle_id,final_price)
  {
      this.id = id; 
      this.cat = cat; 
      this.km = km;
      this.n_days = n_days; 
      this.start = start; 
      this.end = end; 
      this.age = age;
      this.extra_driver = extra_driver; 
      this.extra_ins = extra_ins; 
      this.username = username; 
      this.vehicle_id = vehicle_id; 
      this.final_price = final_price;

  }

  /**
   * Construct a Rent from a plain object
   * @param {{}} json  //json has a Object default prototype
   * @return {Task} the newly created Rent object
   */
  static from(json) {
    return Object.assign(new Rent(json.id, json.cat, json.km, json.n_days, json.start,json.end, json.age, json.extra_driver, json.extra_ins,json.username, json.vehicle_id, json.final_price), json); //in this way we assign to json default prototype Object Exam prototype
                                           
  }
}

export default Rent;
