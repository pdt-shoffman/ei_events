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


async function TriggerAlertStorm(key) {
    console.log('Triggering alert storm')

    var nagios = {
        "event_action": "trigger",
        "client": "Nagios",
        "client_url": "http://54.193.12.191:8000/en-US/app/search/search?q=search%20login",
        "routing_key": key,
        "payload": {
            "summary": `CRITICAL: 'mysql_long_running_query' on 'mysql-prod-db01.pd-ops.net`,
            "source": "Nagios",
            "severity": "critical",
            "custom_details": {
                "IP": "127.0.0.1",
            }
        }
    };

var newrelic = {
        "event_action": "trigger",
        "client": "New Relic",
        "client_url": "http://54.193.12.191:8000/en-US/app/search/search?q=search%20login",
        "routing_key": key,
        "payload": {
            "summary": `Service Monitors (Inventory API Health Check violated API Request Failure)`,
            "source": "New Relic",
            "severity": "critical",
            "custom_details": {
                "IP": "127.0.0.1",
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
	    ],
	  "event_action": "trigger",
	  "routing_key": key
	};

  var datadog2 = {
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
	    ],
	  "event_action": "trigger",
	  "routing_key": key
	};

    var events = [nagios, nagios, nagios, datadog1, splunk, datadog2, newrelic, newrelic, newrelic];
    var event;
    var delay = 3000;
    var info_str = "</br>Kicking off alert storm.</br>"

    for (event of events) {

        var options = {
            data: JSON.stringify(event)
        };

        event_type = event['payload']['source']

        PDCEFEvent(options);
        console.log(event);
        info_str = info_str + "Triggering "+event_type+" event</br>"
        $('#info').html("<p>"+info_str+"</p>");

        await sleep(delay);
        
    }

    info_str = info_str + "All events have triggered"
    $('#info').html("<p>"+info_str+"</p>");
}





function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

$('#trigger-button').on('click', function() {
    var rkey=getParameterByName('routing_key');
    console.log("Routing key is "+rkey)
    TriggerAlertStorm(rkey);
});
