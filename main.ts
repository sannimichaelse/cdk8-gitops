import { Construct } from 'constructs';
import { App, Chart, ChartProps } from 'cdk8s';
import { KubeDeployment, KubeService, IntOrString } from './imports/k8s';

export class MyChart extends Chart {
  constructor(scope: Construct, id: string, props: ChartProps = { }) {
    super(scope, id, props);
    const label = { app: 'nginx-k8s' };
    new KubeService(this, 'service', {
      spec: {
        type: 'ClusterIP',
        ports: [{ port: 80, targetPort: IntOrString.fromNumber(80) }],
        selector: label
      }
    });
    new KubeDeployment(this, 'deployment', {
      spec: {
        replicas: 2,
        selector: {
          matchLabels: label
        },
        template: {
          metadata: { labels: label },
          spec: {
            containers: [
              {
                name: 'nginx',
                image: 'nginx:latest',
                ports: [ { containerPort: 80 } ]
              }
            ]
          }
        }
      }
    });
  }
}

const app = new App();
new MyChart(app, 'nginx');
app.synth();
