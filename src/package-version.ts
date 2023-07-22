import { z } from 'zod';

type MajorType = number;
type MinorType = number;
type PatchType = number;

export const PackageVersionSchema = z
  .string()
  .min(1)
  .refine(
    value => {
      try {
        if (!value.startsWith('v')) return false;

        const [, version] = value.split('v');
        if (!version) return false;

        const [major, minor, patch] = version.split('.');
        if (!major || !minor || !patch) return false;

        if (
          !Number.isInteger(Number(major)) ||
          !Number.isInteger(Number(minor)) ||
          !Number.isInteger(Number(patch))
        ) {
          return false;
        }

        if (
          !Number.isInteger(Number(major)) ||
          !Number.isInteger(Number(minor)) ||
          !Number.isInteger(Number(patch))
        ) {
          return false;
        }

        return true;
      } catch (error) {
        return false;
      }
    },
    { message: 'package.version.error' }
  )
  .transform(value => {
    const [, version] = value.split('v');

    const [major, minor, patch] = version.split('.');

    return {
      major: Number(major),
      minor: Number(minor),
      patch: Number(patch),
    };
  });
export type PackageVersionSchemaType = z.infer<typeof PackageVersionSchema>;

export class PackageVersion {
  major: MajorType;

  minor: MinorType;

  patch: PatchType;

  constructor(payload: {
    major: MajorType;
    minor: MinorType;
    patch: PatchType;
  }) {
    this.major = payload.major;
    this.minor = payload.minor;
    this.patch = payload.patch;
  }

  isGreaterThanOrEqual(another: PackageVersion) {
    if (this.major > another.major) return true;
    if (this.major < another.major) return false;

    if (this.minor > another.minor) return true;
    if (this.minor < another.minor) return false;

    if (this.patch > another.patch) return true;
    if (this.patch < another.patch) return false;

    return true;
  }

  static fromStringWithV(value: string) {
    const version = PackageVersionSchema.parse(value);

    return new PackageVersion({
      major: version.major,
      minor: version.minor,
      patch: version.patch,
    });
  }
}
