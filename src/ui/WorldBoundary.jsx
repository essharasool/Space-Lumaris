import { Component } from 'react';

/** if WebGL or a 3D file fails, keep the story (captions, voice, controls) working */
export default class WorldBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(err) {
    console.warn('3D world failed to load:', err);
  }
  render() {
    return this.state.failed ? <div className="world-fallback" /> : this.props.children;
  }
}
