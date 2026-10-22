import { Component, type ReactNode } from 'react';
import { Button, Text } from '@fluentui/react-components';

interface SceneErrorBoundaryProps {
  children: ReactNode;
}

/** Keeps the rest of the page usable when the 3D view cannot load (no WebGL, failed chunk). */
export class SceneErrorBoundary extends Component<SceneErrorBoundaryProps, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div className="scene-state scene-error">
        <Text weight="semibold">לא הצלחנו להציג את המודל התלת-ממדי</Text>
        <Text size={200}>הרשימה, השלבים והמידות ממשיכים לעבוד. אפשר לנסות לטעון שוב.</Text>
        <Button appearance="primary" onClick={() => window.location.reload()}>טעינה מחדש</Button>
      </div>
    );
  }
}
