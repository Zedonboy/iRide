enum Cutter_Dim{
  x,y
};
class DriverPoint
{
public:
  DriverPoint(){};
  DriverPoint (DriverPoint& dp) = default;
  DriverPoint(double lat, double lon)
  {
    _lat = lat;
    _lon = lon;
  }
  double _lat;
  double _lon;
};

class kdNode
{
public:
  enum Cutter_Dim cutter_dimension;
  kdNode *left;
  kdNode *right;
  DriverPoint *data;
  kdNode() {}
  kdNode(const kdNode &) = delete;
  kdNode(kdNode *rhs)
  {
    cutter_dimension = rhs->cutter_dimension;
    left = rhs->left;
    right = rhs->right;
    data = rhs->data;
  }
  kdNode(kdNode &&) = default;
  kdNode(enum Cutter_Dim cd, kdNode *_left, kdNode *_right, DriverPoint *dp)
  {
    cutter_dimension = cd;
    left = _left;
    right = _right;
    data = dp;
  }
  ~kdNode(){
    delete left;
    delete right;
  }
};

int create_service_area(double lat, double _long);
int getNearestDriverGroup(double lat, double lon, double &nearestLat, double &nearestLong, bool & result){


