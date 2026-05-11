import { Inject } from '@nestjs/common';

export const QDRANT = Symbol('QDRANT');

export const InjectQdrant = () => Inject(QDRANT);
