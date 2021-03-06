/*
* 2014 ObYsKY
*
* NOTICE OF LICENSE
*
* This source file is subject to the Academic Free License (AFL 3.0)
* that is bundled with this package in the file LICENSE.txt.
* It is also available through the world-wide-web at this URL:
* http://opensource.org/licenses/afl-3.0.php
* If you did not receive a copy of the license and are unable to
* obtain it through the world-wide-web, please send an email
* to license@prestashop.com so we can send you a copy immediately.
*
* DISCLAIMER
*
* Do not edit or add to this file if you wish to upgrade PrestaShop to newer
* versions in the future. If you wish to customize PrestaShop for your
* needs please refer to http://www.prestashop.com for more information.
*
* @author ObYsKy <contact.obysky@gmail.com>
* @copyright  2013-2014 Obysky
* @license    http://opensource.org/licenses/afl-3.0.php  Academic Free License (AFL 3.0)
*/

var bb_successCallback;
var bb_errorCallback;
var bb_blackberryTimeout_id=-1;

function handleBlackBerryLocationTimeout()
{
	if(bb_blackberryTimeout_id!=-1)
	{
		bb_errorCallback({message:"Timeout error", code:3});
	}
}
function handleBlackBerryLocation()
{
		clearTimeout(bb_blackberryTimeout_id);
		bb_blackberryTimeout_id=-1;
  if (bb_successCallback && bb_errorCallback)
  {
    if(blackberry.location.latitude==0 && blackberry.location.longitude==0)
    {

bb_errorCallback({message:"Position unavailable", code:2});
    }
    else
    {  
var timestamp=null;
if (blackberry.location.timestamp)
{
  timestamp=new Date(blackberry.location.timestamp);
}
bb_successCallback({timestamp:timestamp, coords: {latitude:blackberry.location.latitude,longitude:blackberry.location.longitude}});
    }

    bb_successCallback = null;
    bb_errorCallback = null;
  }
}

var geo_position_js=function() {

var pub = {};
  var provider=null;

  pub.getCurrentPosition = function(successCallback,errorCallback,options)
  {
    provider.getCurrentPosition(successCallback, errorCallback,options);
  }

  pub.init = function()
  {			
    try
    {
if (typeof(geo_position_js_simulator)!="undefined")
{
  provider=geo_position_js_simulator;
}
else if (typeof(bondi)!="undefined" && typeof(bondi.geolocation)!="undefined")
{
  provider=bondi.geolocation;
}
else if (typeof(navigator.geolocation)!="undefined")
{
  provider=navigator.geolocation;
  pub.getCurrentPosition = function(successCallback, errorCallback, options)
  {
    function _successCallback(p)
    {

if(typeof(p.latitude)!="undefined")
{
  successCallback({timestamp:p.timestamp, coords: {latitude:p.latitude,longitude:p.longitude}});
}
else
{
  successCallback(p);
}
    }
    provider.getCurrentPosition(_successCallback,errorCallback,options);
  }
}
 else if(typeof(window.google)!="undefined" && typeof(google.gears)!="undefined")
{
  provider=google.gears.factory.create('beta.geolocation');
}
else if ( typeof(Mojo) !="undefined" && typeof(Mojo.Service.Request)!="Mojo.Service.Request")
{
  provider=true;
  pub.getCurrentPosition = function(successCallback, errorCallback, options)
  {

  parameters={};
  if(options)
  {
     if (options.enableHighAccuracy && options.enableHighAccuracy==true)
     {
parameters.accuracy=1;
     }
     if (options.maximumAge)
     {
parameters.maximumAge=options.maximumAge;
     }
     if (options.responseTime)
     {
if(options.responseTime<5)
{
  parameters.responseTime=1;
}
else if (options.responseTime<20)
{
  parameters.responseTime=2;
}
else
{
  parameters.timeout=3;
}
     }
  }


   r=new Mojo.Service.Request('palm://com.palm.location', {
    method:"getCurrentPosition",
  parameters:parameters,
  onSuccess: function(p){successCallback({timestamp:p.timestamp, coords: {latitude:p.latitude, longitude:p.longitude,heading:p.heading}});},
  onFailure: function(e){
    if (e.errorCode==1)
    {
errorCallback({code:3,message:"Timeout"});
    }
    else if (e.errorCode==2)
    {
errorCallback({code:2,message:"Position Unavailable"});
    }
    else
    {
errorCallback({code:0,message:"Unknown Error: webOS-code"+errorCode});
    }
  }
  });
  }

}
else if (typeof(device)!="undefined" && typeof(device.getServiceObject)!="undefined")
{
  provider=device.getServiceObject("Service.Location", "ILocation");

  pub.getCurrentPosition = function(successCallback, errorCallback, options)
  {
    function callback(transId, eventCode, result) {
  if (eventCode == 4)
{
errorCallback({message:"Position unavailable", code:2});
  }
else
{
  successCallback({timestamp:null, coords: {latitude:result.ReturnValue.Latitude, longitude:result.ReturnValue.Longitude, altitude:result.ReturnValue.Altitude,heading:result.ReturnValue.Heading}});
}
    }
var criteria = new Object();
  criteria.LocationInformationClass = "BasicLocationInformation";
    provider.ILocation.GetLocation(criteria,callback);
  }
}
else if(typeof(window.blackberry)!="undefined" && blackberry.location.GPSSupported)
{
								if(typeof(blackberry.location.setAidMode)=="undefined")
								{
	  return false;									
								}
								blackberry.location.setAidMode(2);
  pub.getCurrentPosition = function(successCallback,errorCallback,options)
  {

    bb_successCallback=successCallback;
    bb_errorCallback=errorCallback;
										if(options['timeout'])  
										{
										 	bb_blackberryTimeout_id=setTimeout("handleBlackBerryLocationTimeout()",options['timeout']);
										}
										else
										{
											bb_blackberryTimeout_id=setTimeout("handleBlackBerryLocationTimeout()",60000);
										}										
										blackberry.location.onLocationUpdate("handleBlackBerryLocation()");
    blackberry.location.refreshLocation();
  }
  provider=blackberry.location;				
}
    }
    catch (e){ 
					alert("error="+e);
					if(typeof(console)!="undefined")
					{
						console.log(e);
					}
					return false;
				}
    return  provider!=null;
  }


  return pub;
}();