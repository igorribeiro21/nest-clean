import { hash, compare } from 'bcryptjs';

import { HashComparer } from '@/domain/forum/application/cryptography/hash-comparer';
import { HashGenerator } from '@/domain/forum/application/cryptography/hash-generator';

export class BcryptHasher implements HashGenerator, HashComparer {
    private HAHS_SALT_LENGTH = 8;

    async hash(plain: string): Promise<string> {
        return hash(plain, this.HAHS_SALT_LENGTH);
    }

    async compare(plain: string, hash: string): Promise<boolean> {
        return compare(plain,hash);
    }

}