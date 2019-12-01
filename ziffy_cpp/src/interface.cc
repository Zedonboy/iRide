#include "napi.h"
#include "main.h"

napi_value registerService(napi_env env, napi_callback_info info) {
    size_t argc = 0;
    napi_value *argv;
    napi_get_cb_info(env, info, &argc, argv, NULL, NULL);
    double lat, _long;
    napi_get_value_double(env, argv[0], &lat);
    napi_get_value_double(env, argv[1], &_long);

    create_service_area(lat, _long);
    return NULL;

}

napi_value closestPoint(napi_env env, napi_callback_info info) {
    size_t argc = 0;
    napi_value *argv, array;
    napi_get_cb_info(env, info, &argc, argv, NULL, NULL);
    napi_create_array(env, &array);
    double lat, _long, resultLat, resultLong;
    bool result = false;
    getNearestDriverGroup(lat, _long, resultLat, resultLong, result);
    if(result){
        napi_create_array_with_length(env, 2, &array);
        napi_value latJs, longJs;
        napi_create_double(env, resultLat, &latJs);
        napi_create_double(env, resultLong, &longJs);
        napi_set_element(env, array, 0, latJs);
        napi_set_element(env, array, 1, longJs);
    } else {
        napi_create_array_with_length(env, 0, &array);
    }
    return array;
}

napi_value init(napi_env env, napi_value exports)
{
    napi_value irideObj, func1, func2;
    napi_create_object(env, &irideObj);
    napi_create_function(env, "registerService", NAPI_AUTO_LENGTH, registerService, NULL, &func1);
    napi_create_function(env, "closestPoint", NAPI_AUTO_LENGTH, closestPoint, NULL, &func2);
    
    napi_set_named_property(env, irideObj, "registerService", func1);
    napi_set_named_property(env, irideObj, "closestPoint", func2);
    return irideObj;
}

NAPI_MODULE(NODE_GYP_MODULE_NAME, init);