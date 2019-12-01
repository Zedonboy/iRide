#include "LatLong.h"
#include "main.h"
#define K_DISTANCE 15
#include <vector>
#include "stdint.h"
kdNode *node_root;
// ADD service location.
auto vector = std::vector<DriverPoint>(1000);
int create_service_area(double lat, double _long)
{
    for (auto &&i : vector)
    {
        auto distance = distanceEarth(i._lat, i._lon, lat, _long);
        if (distance <= K_DISTANCE)
            return 1;
    }

    auto driverPoint = DriverPoint(lat, _long);
    vector.push_back(driverPoint);
    if (!node_root)
    {
        node_root = new kdNode(x, nullptr, nullptr, new DriverPoint(driverPoint));
        return 0;
    }
    else
    {
        insertIntoTree(driverPoint);
        return 0;
    }
}

static int searchNearestNeighbour(kdNode *result_node, DriverPoint dp)
{
    kdNode *prev = node_root;
    uint32_t minimumDistance = UINT32_MAX;
    while (prev != nullptr)
    {
        auto distance = distanceEarth(dp._lat, dp._lat, prev->data->_lat, prev->data->_lon);
        if (distance <= minimumDistance)
        {
            minimumDistance = distance;
            if (prev->cutter_dimension == x)
            {
                double left_distance = 0;
                double right_distance = 0;
                if (dp._lat <= prev->data->_lat && prev->left != nullptr)
                {
                    left_distance = distanceEarth(dp._lat, dp._lon, prev->left->data->_lat, prev->left->data->_lon);
                }
                else if (prev->right != nullptr)
                {
                    right_distance = distanceEarth(dp._lat, dp._lon, prev->right->data->_lat, prev->right->data->_lon);
                }
                else
                {
                    break;
                }

                if (left_distance <= right_distance)
                {
                    prev = prev->left;
                }
                else
                {
                    prev = prev->right;
                }
            }
            else
            {
                double left_distance = 0;
                double right_distance = 0;
                if (dp._lon <= prev->data->_lon && prev->left != nullptr)
                {
                    left_distance = distanceEarth(dp._lat, dp._lon, prev->left->data->_lat, prev->left->data->_lon);
                }
                else if (prev->right != nullptr)
                {
                    right_distance = distanceEarth(dp._lat, dp._lon, prev->right->data->_lat, prev->right->data->_lon);
                }
                else
                {
                    break;
                }
                if (left_distance <= right_distance)
                {
                    prev = prev->left;
                }
                else
                {
                    prev = prev->right;
                }
            }
        }
    }

    result_node = prev;
    return 0;
}

static int insertIntoTree(DriverPoint &newdp)
{
    // check if t
    kdNode *prev = node_root;
    while (prev != nullptr)
    {
        // it means this is the last
        if (prev->cutter_dimension == x)
        {
            auto dp = prev->data;
            if (dp->_lat >= newdp._lat)
            {
                if (!prev->left)
                {
                    prev->left = new kdNode(y, nullptr, nullptr, new DriverPoint(newdp));
                    break;
                }
                else
                {
                    prev = prev->left;
                }
            }
            else
            {
                if (!prev->right)
                {
                    prev->right = new kdNode(y, nullptr, nullptr, new DriverPoint(newdp));
                    break;
                }
                else
                {
                    prev = prev->right;
                }
            }
        }
        else
        {
            auto dp = prev->data;
            if (dp->_lon >= newdp._lon)
            {
                if (!prev->left)
                {
                    prev->left = new kdNode(x, nullptr, nullptr, new DriverPoint(newdp));
                    break;
                }
                else
                {
                    prev = prev->left;
                }
            }
            else
            {
                if (!prev->right)
                {
                    prev->right = new kdNode(x, nullptr, nullptr, new DriverPoint(newdp));
                    break;
                }
                else
                {
                    prev = prev->right;
                }
            }
        }
    }

    return 0;
}

int getNearestDriverGroup(double lat, double lon, double &nearestLat, double &nearestLong, bool & result){
    DriverPoint dp;
    dp._lat = lat;
    dp._lon = lon;
    kdNode *nearestode = nullptr;
    int rst = searchNearestNeighbour(nearestode, dp);
    if(rst == 0 && nearestode != nullptr){
        result = true;
        nearestLat = nearestode->data->_lat;
        nearestLong = nearestode->data->_lon;
    } else {
        result = false;
    }
}