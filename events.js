function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, " "));
}


function PDCEFEvent(options) {
    var merged = $.extend(true, {}, {
            type: "POST",
            dataType: "json",
            headers: {
                "Accept": "application/vnd.pagerduty+json;version=2.0"
            },
            url: "https://events.pagerduty.com/v2/enqueue"

        },
        options);

    $.ajax(merged);
}

function PDChangeEvent(options) {
    var merged = $.extend(true, {}, {
            type: "POST",
            dataType: "json",
            headers: {
                'Content-Type': "application/json",
    			'Accept': "application/json"
            },
            url: "https://events.pagerduty.com/v2/change/enqueue"

        },
        options);

    $.ajax(merged);
}

async function TriggerChangeEvents(key) {
	console.log('Triggering change events')

	var timestamp = Date.now();
	var change_timestamp = timestamp - 900000;
	
	var prev_timestamp_iso = new Date(change_timestamp);


	console.log('Change timestamp is '+prev_timestamp_iso.toString())


	var change1 = { 
		  "routing_key": key,
		  "payload": {
		    "summary": "valramirez pushed branch master from rest_api_svc",
		    "source": "GitHub",
		    "timestamp": prev_timestamp_iso,
		    "custom_details": {
		      
		    }		
		}
	};

	var change2 =  { 
		  "routing_key": key,
		  "payload": {
		    "summary": "Build Successful: Merge pull request #42 from rest_api_svc",
		    "source": "Buildkite",
		    "timestamp": prev_timestamp_iso
		}
	};

	var events = [change1, change2];
    var event;
    var info_str = "</br>Kicking off change events.</br>"

    for (event of events) {

    	event_type = event['payload']['source']
    	

        var options = {
            data: JSON.stringify(event)
        };


        PDChangeEvent(options);
        info_str = info_str + "Triggering "+event_type+" event</br>"
        $('#info').html("<p>"+info_str+"</p>");

        
    }
}

async function TriggerAlertStorm(key) {
    console.log('Triggering alert storm')
    var db_num=Math.round(Math.random() * 10);

    var nagios = {
        "event_action": "trigger",
        "client": "Nagios",
        "client_url": "http://54.193.12.191:8000/en-US/app/search/search?q=search%20login",
        "routing_key": key,
        "payload": {
		  "summary": "CRITICAL: 'mysql_long_running_query' on 'mysql-prod-db0"+db_num+".pd-ops.net'",
  		  "severity": "warning",
  		  "source": "Nagios",
  		  "custom_details": {
	          "pd_nagios_object": "service",
	          "SERVICESTATE": "CRITICAL",
	          "SERVICEPROBLEMID": "221215",
	          "SERVICEOUTPUT": "QUERY CRITICAL: select * from order",
	          "SERVICEDISPLAYNAME": "mysql_long_running_query",
	          "SERVICEDESC": "mysql_long_running_query",
	          "HOSTNAME": "mysql-prod-db0$DB_NUM.pd-ops.net",
	          "HOSTDISPLAYNAME": "mysql-prod-db0$DB_NUM.pd-ops.net"
        	}
    	}
	};

//DEPRICATED
	var newrelic = {
        "event_action": "trigger",
        "client": "New Relic",
		"client_url": "https://alerts.newrelic.com/accounts/1985859/incidents/62835129",
        "routing_key": key,
        "payload": {
  			"summary": "Service Monitors (API Health Check violated API Request Failure)",
  			"severity": "critical",
  			"source": "New Relic",
  			"custom_details": {
      			"violation_callback_url": "https://synthetics.newrelic.com/accounts/1985859/monitors/704df0e2-dcc9-48f8-8756-dd83554c5da3/results/4a1a333d-2346-4a81-8091-dbf623d5016f",
      			"version": "1.0",
      			"targets": [
       				{
			          "type": "Monitor",
			          "product": "SYNTHETICS",
			          "name": "API Health Check",
			          "link": "https://synthetics.newrelic.com/accounts/1985859/monitors/704df0e2-dcc9-48f8-8756-dd83554c5da3/results/4a1a333d-2346-4a81-8091-dbf623d5016f",
			          "labels": {},
			          "id": "us-west-1"
			        }
			      ],
  				"policy_url": "https://alerts.newrelic.com/accounts/1985859/policies/423861",
  				"policy_name": "Service Monitors",
  				"open_violations_count": {
  					"warning": "0",
		        	"critical": "1"
		      	},
		      "incident_url": "https://alerts.newrelic.com/accounts/1985859/incidents/62835129",
		      "incident_id": "62835129",
		      "incident_acknowledge_url": "https://alerts.newrelic.com/accounts/1985859/incidents/62835129/acknowledge",
		      "event_type": "INCIDENT",
		      "duration": "658",
		      "details": "Monitor failed for location Freemont, CA, USA",
		      "current_state": "open",
		      "condition_name": "API Request Failure",
		      "condition_id": "47340281",
		      "condition_family_id": "10419059",
		      "closed_violations_count": {
		        "warning": "0",
		        "critical": "0"
		      },
		      "account_name": "PagerDuty",
		      "account_id": "1985859"
			}
		}
    };

 var splunk = {
        "event_action": "trigger",
        "client": "Splunk",
        "client_url": "http://54.193.12.191:8000/en-US/app/search/search?q=search%20login",
        "routing_key": key,
        "payload": {
            "summary": `Splunk Alert: Error connecting to MySQL: Too many connections (code 1040)`,
            "source": "splunk",
            "severity": "critical",
            "custom_details": {
                "IP": "127.0.0.1",
            }
        }
    };

  var datadog1 = {
        "event_action": "trigger",
        "client": "Data Dog",
        "client_url": "http://54.193.12.191:8000/en-US/app/search/search?q=search%20login",
        "routing_key": key,
        "payload":{
	        "summary": "Request Response Time is High for prod - (95th percentile > 100 ms on average during the last 10m)",
	        "severity": "warning",
	        "source": "DataDog",
	        "custom_details": {
	            "title": "Request Response Time is High for prod - (95th percentile > 100 ms on average during the last 10m)",
	            "tags": "auto-managed, aws_env:prod, monitor",
	            "query": "avg(last_10m):avg:paymentsapi.result_duration_msec.95percentile{aws_env:prod} > 100",
	            "priority": "normal",
	            "org": "PagerDuty, Inc.",
	            "monitor_state": "Triggered",
	            "event_type": "metric_alert_monitor",
	            "event_id": "4858216653438624768",
	            "body": "SumoLogic logs: `_sourceCategory=production/payments-api/*`. Check [PS Operations wiki](https://pagerduty.atlassian.net/wiki/spaces/PAYMENTS/pages/238878819/Payments+API+Operations) for any known issues. [Notify: @pagerduty-Payments-API] paymentsapi.result_duration_msec.95percentile over aws_env:prod was > 100.0 on average during the last 10m. Metric value: 101.18"
	          }

	    },
	  "client": "Data dog",
	  "client_url": "https://app.datadoghq.com/event/event?id=4858216653438624768",
	  "images": [{
	  	 "src": "https://p.datadoghq.com/snapshot/view/dd-snapshots-prod/org_1804/2019-03-29/2e5ce0e2558a4eca8db342a471405dc30764dd1e.png",
	      "href": "https://app.datadoghq.com/monitors#8449881?to_ts=1553835191000&from_ts=1553827931000",
	      "alt": "Snapshot of metric"
	  	}],
	  	"links": [
	  		{
	  		"text": "Monitor Status",
	      	"href": "https://app.datadoghq.com/monitors#8449881?to_ts=1553835191000&from_ts=1553827931000"
	      	},
	      	{
	      	"text": "Triggered Monitors",
	      	"href": "https://app.datadoghq.com/monitors/triggered"
	      	}
	    ]
    };

  var datadog2 = {
        "event_action": "trigger",
        "client": "Data Dog",
        "client_url": "http://54.193.12.191:8000/en-US/app/search/search?q=search%20login",
        "routing_key": key,
        "payload":{
	        "summary": "Request Response Time is High for prod - (95th percentile > 250 ms on average during the last 10m)",
	        "severity": "critical",
	        "source": "DataDog",
	        "custom_details": {
	            "title": "Request Response Time is High for prod - (95th percentile > 250 ms on average during the last 10m)",
	            "tags": "auto-managed, aws_env:prod, monitor",
	            "query": "avg(last_10m):avg:paymentsapi.result_duration_msec.95percentile{aws_env:prod} > 250",
	            "priority": "normal",
	            "org": "PagerDuty, Inc.",
	            "monitor_state": "Triggered",
	            "event_type": "metric_alert_monitor",
	            "event_id": "4858216653438624768",
	            "body": "SumoLogic logs: `_sourceCategory=production/payments-api/*`. Check [PS Operations wiki](https://pagerduty.atlassian.net/wiki/spaces/PAYMENTS/pages/238878819/Payments+API+Operations) for any known issues. [Notify: @pagerduty-Payments-API] chfapi.result_duration_msec.95percentile over aws_env:prod was > 250.0 on average during the last 10m. Metric value: 278.34"
	          }
	    },
	  "client": "Data dog",
	  "client_url": "https://app.datadoghq.com/event/event?id=4858216653438624768",
	  "images": [{
	  	 "src": "https://p.datadoghq.com/snapshot/view/dd-snapshots-prod/org_1804/2019-03-29/2e5ce0e2558a4eca8db342a471405dc30764dd1e.png",
	      "href": "https://app.datadoghq.com/monitors#8449881?to_ts=1553835191000&from_ts=1553827931000",
	      "alt": "Snapshot of metric"
	  	}],
	  	"links": [
	  		{
	  		"text": "Monitor Status",
	      	"href": "https://app.datadoghq.com/monitors#8449881?to_ts=1553835191000&from_ts=1553827931000"
	      	},
	      	{
	      	"text": "Triggered Monitors",
	      	"href": "https://app.datadoghq.com/monitors/triggered"
	      	}
	    ]
    };

    var disk = {
    	"event_action": "trigger",
        "client": "New Relic",
        "client_url": "http://54.193.12.191:8000/en-US/app/search/search?q=search%20login",
        "routing_key": key,
        "payload": {
			"client": "New Relic", 
			"client_url": "https://one.newrelic.com", 
			"links": [ 
			{ "href": "https://radar-api.service.newrelic.com/accounts/1377700/issues/fddaf308-36ab-4d30-8b31-010127a22a10?notifier=PAGERDUTY_SERVICE_INTEGRATION", "text": "Issue Page" } ], 
			"summary": "Disk Used % > 70.0 for at least 2 minutes on 'ip-10-64-0-228 (/)'", 
			"event_action": "trigger", 
			"severity":"critical", 
			"source": "New Relic", 
			"custom_details": { 
				"Alert Condition Names": "High Disk Utilization", 
				"Alert Policy Names": "Disk Utilization", 
				"Description": "Policy: 'Disk Utilization'. Condition: 'High Disk Utilization'", 
				"Impacted Entities": "ip-10-64-0-228 (/)", 
				"IssueURL": "https://radar-api.service.newrelic.com/accounts/1377700/issues/fddaf308-36ab-4d30-8b31-010127a22a10?notifier=PAGERDUTY_SERVICE_INTEGRATION", "NewRelic priority": "CRITICAL", "Runbook": "", "Total Incidents": "1", "Workflow Name": "Policy: 3818680 - Disk Utilization", "id": "fddaf308-36ab-4d30-8b31-010127a22a10", "isCorrelated": "false" } 
		} 
	}
    

    var events = [disk, nagios, nagios, nagios, datadog1, splunk, datadog2];
    var event;
    var delay = 3000;
    var info_str = "</br>Kicking off alert storm.</br>"

    for (event of events) {

    	event_type = event['payload']['source']
    	

        var options = {
            data: JSON.stringify(event)
        };


        PDCEFEvent(options);
        console.log(event);
        info_str = info_str + "Triggering "+event_type+" event</br>"
        $('#info').html("<p>"+info_str+"</p>");

        await sleep(delay);
        
    }

    TriggerSyntheticEvents(key,info_str);

    
}



async function TriggerSyntheticEvents(key,info_str) {
	var locations = [["Freemont, CA, USA","us-west-1"], ["Washington, DC, USA","us-east-1"], ["Columbus, OH, USA","us-east-2"], ["Portland, OR, USA","us-west-2"],["San Francisco, CA, USA","us-west-1" ],["Montreal, Québec, CA","ca-central-1" ],["Dallas, TX, USA", "us-central-1"],["Newark, NJ, USA", "us-east-1"  ],["Sydney, AU","ap-southeast-2"],["Paris, FR","eu-west-3" ],["London, England, UK","eu-west-2"],["Frankfurt, DE","eu-central-1" ],["Dublin, IE","eu-west-1"], ["Tokyo, JP","ap-northeast-1"], ["Singapore,SG","ap-southeast-1"], ["São Paulo, BR", "sa-east-1"],[ "Seoul, KR", "ap-northeast-2"], ["Mumbai, IN","ap-south-1"]];
	var location_count = locations.length;

	console.log(location_count);
	for (var location=0; location < locations.length; location++){

		var location_name = locations[location][0];
		var location_id = locations[location][1];
		
		var newrelic = {
	        "event_action": "trigger",
	        "client": "New Relic",
			"client_url": "https://alerts.newrelic.com/accounts/1985859/incidents/62835129",
	        "routing_key": key,
	        "payload": {
	  			"summary": "Service Monitors (API Health Check violated API Request Failure)",
	  			"severity": "critical",
	  			"source": "New Relic",
	  			"custom_details": {
	      			"violation_callback_url": "https://synthetics.newrelic.com/accounts/1985859/monitors/704df0e2-dcc9-48f8-8756-dd83554c5da3/results/4a1a333d-2346-4a81-8091-dbf623d5016f",
	      			"version": "1.0",
	      			"targets": [
	       				{
				          "type": "Monitor",
				          "product": "SYNTHETICS",
				          "name": "API Health Check",
				          "link": "https://synthetics.newrelic.com/accounts/1985859/monitors/704df0e2-dcc9-48f8-8756-dd83554c5da3/results/4a1a333d-2346-4a81-8091-dbf623d5016f",
				          "labels": {},
				          "id": location_id
				        }
				      ],
	  				"policy_url": "https://alerts.newrelic.com/accounts/1985859/policies/423861",
	  				"policy_name": "Service Monitors",
	  				"open_violations_count": {
	  					"warning": "0",
			        	"critical": "1"
			      	},
			      "incident_url": "https://alerts.newrelic.com/accounts/1985859/incidents/62835129",
			      "incident_id": "62835129",
			      "incident_acknowledge_url": "https://alerts.newrelic.com/accounts/1985859/incidents/62835129/acknowledge",
			      "event_type": "INCIDENT",
			      "duration": "658",
			      "details": "Monitor failed for location "+location_name,
			      "current_state": "open",
			      "condition_name": "API Request Failure",
			      "condition_id": "47340281",
			      "condition_family_id": "10419059",
			      "closed_violations_count": {
			        "warning": "0",
			        "critical": "0"
			      },
			      "account_name": "PagerDuty",
			      "account_id": "1985859"
				}
			}
	    };

	    var delay = 3000;
	    event_type = newrelic['payload']['source']
    	

        var options = {
            data: JSON.stringify(newrelic)
        };


        PDCEFEvent(options);
        console.log(event);
        info_str = info_str + "Triggering "+event_type+" event</br>"
        $('#info').html("<p>"+info_str+"</p>");

        await sleep(delay);


	}

	info_str = info_str + "<b>All events have triggered</b>";
    $('#info').html("<p>"+info_str+"</p>");
}




function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

$('#trigger-button').on('click', function() {
    var rkey=getParameterByName('routing_key');
    var ckey=getParameterByName('change_key');
    console.log("Routing key is "+rkey);
    console.log("Change event key is "+ckey)
    TriggerChangeEvents(ckey);
    TriggerAlertStorm(rkey);
});
